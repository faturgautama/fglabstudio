// src/app/services/pages/application/inventory/stock-opname.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';
import { StockCardService } from './stock-card.service';
import { ProductWarehouseStockService } from './product-warehouse-stock.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockOpnameService extends BaseActionService<InventoryModel.StockOpname> {
  private databaseService = inject(DatabaseService);
  private stockCardService = inject(StockCardService);
  private productWarehouseStockService = inject(ProductWarehouseStockService);

  protected override table = this.databaseService.db.stock_opnames;

  /**
   * Generate opname number
   */
  generateOpnameNumber() {
    return this.withLoading(async () => {
      return await this.generateOpnameNumberSync();
    });
  }

  /**
   * Generate opname number synchronously
   */
  private async generateOpnameNumberSync(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await this.databaseService.db.stock_opnames.count();

    return `SO/${year}${month}/${String(count + 1).padStart(4, '0')}`;
  }

  /**
   * Create stock opname with items
   */
  createStockOpname(
    opname: Omit<InventoryModel.StockOpname, 'id' | 'created_at'>,
    items: Omit<InventoryModel.StockOpnameItem, 'id' | 'stock_opname_id'>[]
  ) {
    return this.withLoading(async () => {
      // Calculate totals
      const total_products = items.length;
      const total_discrepancy = items.reduce((sum, item) => sum + Math.abs(item.difference), 0);

      // Add opname
      const opname_data: any = {
        ...opname,
        total_products,
        total_discrepancy,
        created_at: new Date(),
        is_active: true
      };

      const opname_id = await this.databaseService.db.stock_opnames.add(opname_data);

      // Add opname items
      const opname_items = items.map(item => ({
        ...item,
        stock_opname_id: opname_id.toString()
      }));

      await this.databaseService.db.stock_opname_items.bulkAdd(opname_items as any);

      return opname_id;
    });
  }

  /**
   * Get stock opname with items
   */
  getStockOpnameWithItems(opname_id: string) {
    return this.withLoading(async () => {
      const opname = await this.databaseService.db.stock_opnames.get(Number(opname_id));
      if (!opname) return null;

      const items = await this.databaseService.db.stock_opname_items
        .where('stock_opname_id')
        .equals(opname_id)
        .toArray();

      // Resolve product info
      const items_with_product = await Promise.all(
        items.map(async (item) => {
          const product = await this.databaseService.db.products.get(Number(item.product_id));
          return { ...item, product };
        })
      );

      return { ...opname, items: items_with_product };
    });
  }

  /**
   * Update opname item
   */
  updateOpnameItem(item_id: string, physical_stock: number, notes?: string) {
    return this.withLoading(async () => {
      const item = await this.databaseService.db.stock_opname_items.get(Number(item_id));
      if (!item) throw new Error('Opname item not found');

      const difference = physical_stock - item.system_stock;

      await this.databaseService.db.stock_opname_items.update(Number(item_id), {
        physical_stock,
        difference,
        notes
      });

      // Recalculate opname totals
      await this.recalculateOpnameTotals(item.stock_opname_id!);

      return item_id;
    });
  }

  /**
   * Approve stock opname (update actual stock per warehouse)
   */
  approveStockOpname(opname_id: number, approved_by: string) {
    return this.withLoading(async () => {
      const opname = await this.databaseService.db.stock_opnames.get(Number(opname_id));
      if (!opname) throw new Error('Stock opname not found');

      if (opname.status === 'APPROVED') {
        throw new Error('Stock opname sudah disetujui');
      }

      if (!opname.warehouse_id) {
        throw new Error('Stock opname must have warehouse_id');
      }

      const warehouse = await this.databaseService.db.warehouses.get(Number(opname.warehouse_id));
      if (!warehouse) throw new Error('Warehouse not found');

      // Get all items
      const items = await this.databaseService.db.stock_opname_items
        .where('stock_opname_id')
        .equals(opname_id)
        .toArray();

      // Update stock for each item with difference
      for (const item of items) {
        if (item.difference !== 0) {
          const product = await this.databaseService.db.products.get(Number(item.product_id));
          if (!product) continue;

          // Add to stock card with warehouse
          await firstValueFrom(this.stockCardService.addStockCard(
            item.product_id!,
            opname.warehouse_id,
            'ADJUSTMENT',
            Math.abs(item.difference),
            'STOCK_OPNAME',
            opname_id,
            `Stock Opname: ${opname.opname_number} at ${warehouse.name} - ${item.notes || 'Adjustment'}`,
            product.purchase_price
          ));
        }
      }

      // Update opname status
      await this.databaseService.db.stock_opnames.update(Number(opname_id), {
        status: 'APPROVED',
        approved_by,
        approved_at: new Date()
      });

      return opname_id;
    });
  }

  /**
   * Complete stock opname (close without approval)
   */
  completeStockOpname(opname_id: string) {
    return this.withLoading(async () => {
      return await this.databaseService.db.stock_opnames.update(Number(opname_id), {
        status: 'COMPLETED'
      });
    });
  }

  /**
   * Recalculate opname totals
   */
  private async recalculateOpnameTotals(opname_id: number) {
    const items = await this.databaseService.db.stock_opname_items
      .where('stock_opname_id')
      .equals(opname_id)
      .toArray();

    const total_discrepancy = items.reduce((sum, item) => sum + Math.abs(item.difference), 0);

    await this.databaseService.db.stock_opnames.update(Number(opname_id), {
      total_discrepancy
    });
  }

  /**
   * Get products for opname (all active products with current stock)
   */
  getProductsForOpname(warehouse_id?: number) {
    return this.withLoading(async () => {
      let products = await this.databaseService.db.products
        .filter(p => p.is_active)
        .toArray();

      console.log("products =>", products);

      // TODO: Filter by warehouse if needed
      // if (warehouse_id) {
      //   products = products.map(async (item) => {
      //     const stock_card = await this.databaseService.db.stock_cards
      //       .filter(stock => stock.product_id == item.id)
      //       .first();

      //     item.current_stock = stock_card ? stock_card.total_value! : 0;

      //     return item;
      //   })
      // }

      return products.map(p => ({
        product_id: p.id!,
        product_name: p.name,
        product_sku: p.sku,
        system_stock: p.current_stock,
        physical_stock: p.current_stock, // Default same as system
        difference: 0,
        unit: p.unit
      }));
    });
  }

  /**
   * Get opname summary by status
   */
  getOpnameSummary() {
    return this.withLoading(async () => {
      const all_opnames = await this.databaseService.db.stock_opnames
        .filter(o => o.is_active !== false)
        .toArray();

      const summary = {
        total: all_opnames.length,
        draft: all_opnames.filter(o => o.status === 'DRAFT').length,
        in_progress: all_opnames.filter(o => o.status === 'IN_PROGRESS').length,
        completed: all_opnames.filter(o => o.status === 'COMPLETED').length,
        approved: all_opnames.filter(o => o.status === 'APPROVED').length,
        total_discrepancy: all_opnames
          .filter(o => o.status === 'APPROVED')
          .reduce((sum, o) => sum + o.total_discrepancy, 0)
      };

      return summary;
    });
  }
}