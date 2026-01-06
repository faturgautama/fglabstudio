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
   * Enhanced to support batch tracking
   */
  createStockOpname(
    opname: Omit<InventoryModel.StockOpname, 'id' | 'created_at'>,
    items: Omit<InventoryModel.StockOpnameItem, 'id' | 'stock_opname_id'>[]
  ) {
    return this.withLoading(async () => {
      // Calculate totals
      const total_products = items.length;
      let total_discrepancy = 0;
      let batch_discrepancy = 0;
      let serial_discrepancy = 0;
      let general_discrepancy = 0;

      // Add opname
      const opname_data: any = {
        ...opname,
        total_products,
        total_discrepancy: 0, // Will be calculated after items
        batch_discrepancy: 0,
        serial_discrepancy: 0,
        general_discrepancy: 0,
        created_at: new Date(),
        is_active: true
      };

      const opname_id = await this.databaseService.db.stock_opnames.add(opname_data);

      // Process each item and detect tracking type
      for (const item of items) {
        const product = await this.databaseService.db.products.get(Number(item.product_id));
        if (!product) continue;

        // Determine tracking type
        let tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL' = 'GENERAL';
        if (product.is_batch_tracked) {
          tracking_type = 'BATCH';
        } else if (product.is_serial_tracked) {
          tracking_type = 'SERIAL';
        }

        // Add opname item
        const opname_item_data = {
          ...item,
          stock_opname_id: opname_id.toString(),
          tracking_type
        };

        const item_id = await this.databaseService.db.stock_opname_items.add(opname_item_data as any);

        // If batch-tracked, load and create batch items
        if (tracking_type === 'BATCH' && opname.warehouse_id) {
          const batches = await this.loadBatchesForOpname(
            Number(item.product_id),
            opname.warehouse_id
          );

          // Set opname_item_id for each batch
          const batch_items = batches.map(batch => ({
            ...batch,
            opname_item_id: Number(item_id)
          }));

          // Store batch items
          await this.databaseService.db.stock_opname_batch_items.bulkAdd(batch_items as any);

          // Calculate batch discrepancy (sum of all batch differences)
          const batch_diff = batches.reduce((sum, b) => sum + Math.abs(b.difference), 0);
          batch_discrepancy += batch_diff;
          total_discrepancy += batch_diff;
        } else if (tracking_type === 'SERIAL' && opname.warehouse_id) {
          // If serial-tracked, load and create serial items
          const serials = await this.loadSerialsForOpname(
            Number(item.product_id),
            opname.warehouse_id
          );

          // Set opname_item_id for each serial
          const serial_items = serials.map(serial => ({
            ...serial,
            opname_item_id: Number(item_id)
          }));

          // Store serial items
          await this.databaseService.db.stock_opname_serial_items.bulkAdd(serial_items as any);

          // Calculate serial discrepancy (count of not found serials)
          const serial_diff = serials.filter(s => !s.found).length;
          serial_discrepancy += serial_diff;
          total_discrepancy += serial_diff;
        } else {
          // For general tracking, use item difference
          const item_diff = Math.abs(item.difference);
          general_discrepancy += item_diff;
          total_discrepancy += item_diff;
        }
      }

      // Update opname with calculated discrepancies
      await this.databaseService.db.stock_opnames.update(Number(opname_id), {
        total_discrepancy,
        batch_discrepancy,
        serial_discrepancy,
        general_discrepancy
      });

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
   * Enhanced with tracking type routing
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

      // Route to appropriate approval method based on tracking type
      for (const item of items) {
        const tracking_type = item.tracking_type || 'GENERAL';

        if (tracking_type === 'BATCH') {
          // Route to batch approval
          await this.approveBatchOpnameItem(item.id!);
        } else if (tracking_type === 'SERIAL') {
          // Route to serial approval
          await this.approveSerialOpnameItem(item.id!);
        } else {
          // Route to general approval
          await this.approveGeneralOpnameItem(item.id!);
        }
      }

      // Validate total_stock invariant after all approvals
      await this.validateTotalStockInvariant(opname.warehouse_id);

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
   * Update opname status with validation
   * Allow DRAFT → IN_PROGRESS → COMPLETED → APPROVED
   * Prevent edits when status = APPROVED
   */
  updateOpnameStatus(opname_id: number, new_status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED') {
    return this.withLoading(async () => {
      const opname = await this.databaseService.db.stock_opnames.get(Number(opname_id));
      if (!opname) throw new Error('Stock opname not found');

      // Validate status transitions
      const valid_transitions: Record<string, string[]> = {
        'DRAFT': ['IN_PROGRESS', 'COMPLETED'],
        'IN_PROGRESS': ['COMPLETED', 'DRAFT'],
        'COMPLETED': ['APPROVED', 'IN_PROGRESS'],
        'APPROVED': [] // Cannot transition from APPROVED
      };

      const allowed = valid_transitions[opname.status] || [];
      if (!allowed.includes(new_status)) {
        throw new Error(`Invalid status transition from ${opname.status} to ${new_status}`);
      }

      await this.databaseService.db.stock_opnames.update(Number(opname_id), {
        status: new_status
      });

      return opname_id;
    });
  }

  /**
   * Complete stock opname (close without approval)
   */
  completeStockOpname(opname_id: string) {
    return this.updateOpnameStatus(Number(opname_id), 'COMPLETED');
  }

  /**
   * Check if opname can be edited
   * Allow edits when status = DRAFT or IN_PROGRESS
   * Prevent edits when status = APPROVED
   */
  canEditOpname(opname_id: number) {
    return this.withLoading(async () => {
      const opname = await this.databaseService.db.stock_opnames.get(Number(opname_id));
      if (!opname) return false;

      return opname.status === 'DRAFT' || opname.status === 'IN_PROGRESS';
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
   * Load batches for opname creation
   * Query product_batches table by product_id and warehouse_id
   * Filter by is_active = true and quantity > 0
   * Calculate is_expired and days_to_expiry
   */
  async loadBatchesForOpname(
    product_id: number,
    warehouse_id: number
  ): Promise<InventoryModel.OpnameBatchItem[]> {
    const batches = await this.databaseService.db.product_batches
      .where('[product_id+warehouse_id]')
      .equals([product_id.toString(), warehouse_id])
      .filter(batch => batch.is_active && batch.quantity > 0)
      .toArray();

    const now = new Date();

    return batches.map(batch => {
      const is_expired = batch.expiry_date ? batch.expiry_date < now : false;
      const days_to_expiry = batch.expiry_date
        ? Math.ceil((batch.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;

      return {
        opname_item_id: 0, // Will be set when creating opname item
        batch_id: batch.id!,
        batch_number: batch.batch_number,
        expiry_date: batch.expiry_date,
        system_quantity: batch.quantity,
        physical_quantity: 0, // Initially 0, user will input
        difference: -batch.quantity, // Initially negative (missing)
        is_expired,
        days_to_expiry,
        created_at: new Date()
      };
    });
  }

  /**
   * Load serials for opname creation
   * Query product_serials table by product_id and warehouse_id
   * Filter by status = IN_STOCK
   */
  async loadSerialsForOpname(
    product_id: number,
    warehouse_id: number
  ): Promise<InventoryModel.OpnameSerialItem[]> {
    const serials = await this.databaseService.db.product_serials
      .where('[product_id+warehouse_id]')
      .equals([product_id, warehouse_id])
      .filter(serial => serial.status === 'IN_STOCK')
      .toArray();

    return serials.map(serial => ({
      opname_item_id: 0, // Will be set when creating opname item
      serial_id: serial.id!,
      serial_number: serial.serial_number,
      expected_status: 'IN_STOCK',
      found: false, // Initially false, user will mark as found
      created_at: new Date()
    }));
  }

  /**
   * Update physical count for a specific batch item
   * Calculate difference = physical_quantity - system_quantity
   * Update opname total_discrepancy and batch_discrepancy
   * Includes validation for physical count
   */
  async updateBatchPhysicalCount(
    opname_item_id: number,
    batch_id: number,
    physical_qty: number,
    notes?: string
  ): Promise<{ success: boolean; warning?: string }> {
    // Validate physical_quantity >= 0
    if (physical_qty < 0) {
      throw new Error('Physical quantity cannot be negative');
    }

    // Get the batch item
    const batchItem = await this.databaseService.db.stock_opname_batch_items
      .where('opname_item_id')
      .equals(opname_item_id)
      .filter(item => item.batch_id === batch_id)
      .first();

    if (!batchItem) {
      throw new Error('Batch item not found');
    }

    // Calculate difference
    const difference = physical_qty - batchItem.system_quantity;
    const difference_percentage = batchItem.system_quantity > 0
      ? Math.abs(difference / batchItem.system_quantity) * 100
      : 0;

    // Validation: Warn if difference > 50% of system_quantity
    let warning: string | undefined;
    if (difference_percentage > 50) {
      warning = `Large discrepancy detected: ${difference_percentage.toFixed(1)}% difference from system stock. Please confirm and add notes explaining the discrepancy.`;

      // Require notes for large discrepancies
      if (!notes || notes.trim().length === 0) {
        throw new Error('Notes are required for discrepancies greater than 50% of system stock');
      }
    }

    // Update batch item
    await this.databaseService.db.stock_opname_batch_items.update(batchItem.id!, {
      physical_quantity: physical_qty,
      difference,
      notes: notes || batchItem.notes
    });

    // Recalculate opname totals
    await this.recalculateBatchDiscrepancy(opname_item_id);

    return { success: true, warning };
  }

  /**
   * Mark a serial as found or not found
   * Update found flag for specific serial item
   * Calculate found_count and missing_count
   * Update opname total_discrepancy and serial_discrepancy
   * Includes validation for serial marking
   */
  async markSerialAsFound(
    opname_item_id: number,
    serial_id: number,
    found: boolean,
    notes?: string
  ): Promise<{ success: boolean; warning?: string }> {
    // Get the serial item
    const serialItem = await this.databaseService.db.stock_opname_serial_items
      .where('opname_item_id')
      .equals(opname_item_id)
      .filter(item => item.serial_id === serial_id)
      .first();

    if (!serialItem) {
      throw new Error('Serial item not found');
    }

    // Validation: Require notes when marking serial as not found
    if (!found && (!notes || notes.trim().length === 0)) {
      throw new Error('Notes are required when marking a serial as not found');
    }

    // Check if all serials will be marked as not found
    const allSerials = await this.databaseService.db.stock_opname_serial_items
      .where('opname_item_id')
      .equals(opname_item_id)
      .toArray();

    const otherFoundSerials = allSerials.filter(s => s.id !== serialItem.id && s.found);

    let warning: string | undefined;
    if (!found && otherFoundSerials.length === 0 && allSerials.length > 1) {
      warning = 'Warning: All serials are marked as not found. This requires manager approval.';
    }

    // Update serial item
    await this.databaseService.db.stock_opname_serial_items.update(serialItem.id!, {
      found,
      notes: notes || serialItem.notes
    });

    // Recalculate opname totals
    await this.recalculateSerialDiscrepancy(opname_item_id);

    return { success: true, warning };
  }

  /**
   * Recalculate serial discrepancy for an opname item and update parent opname
   */
  private async recalculateSerialDiscrepancy(opname_item_id: number): Promise<void> {
    // Get the opname item
    const opnameItem = await this.databaseService.db.stock_opname_items.get(opname_item_id);
    if (!opnameItem) return;

    // Get all serial items for this opname item
    const serialItems = await this.databaseService.db.stock_opname_serial_items
      .where('opname_item_id')
      .equals(opname_item_id)
      .toArray();

    // Calculate found and missing counts
    const found_count = serialItems.filter(item => item.found).length;
    const missing_count = serialItems.filter(item => !item.found).length;

    // Get all items for the parent opname
    const allItems = await this.databaseService.db.stock_opname_items
      .where('stock_opname_id')
      .equals(opnameItem.stock_opname_id!)
      .toArray();

    // Calculate total serial discrepancy across all items (missing serials)
    let total_serial_discrepancy = 0;
    for (const item of allItems) {
      const serials = await this.databaseService.db.stock_opname_serial_items
        .where('opname_item_id')
        .equals(item.id!)
        .toArray();
      total_serial_discrepancy += serials.filter(s => !s.found).length;
    }

    // Get current opname
    const opname = await this.databaseService.db.stock_opnames.get(Number(opnameItem.stock_opname_id));
    if (!opname) return;

    // Calculate total discrepancy (batch + serial + general)
    const total_discrepancy = (opname.batch_discrepancy || 0) + total_serial_discrepancy + (opname.general_discrepancy || 0);

    // Update opname
    await this.databaseService.db.stock_opnames.update(Number(opnameItem.stock_opname_id), {
      serial_discrepancy: total_serial_discrepancy,
      total_discrepancy
    });
  }

  /**
   * Recalculate batch discrepancy for an opname item and update parent opname
   */
  private async recalculateBatchDiscrepancy(opname_item_id: number): Promise<void> {
    // Get the opname item
    const opnameItem = await this.databaseService.db.stock_opname_items.get(opname_item_id);
    if (!opnameItem) return;

    // Get all batch items for this opname item
    const batchItems = await this.databaseService.db.stock_opname_batch_items
      .where('opname_item_id')
      .equals(opname_item_id)
      .toArray();

    // Calculate total batch discrepancy for this item
    const item_batch_discrepancy = batchItems.reduce((sum, item) => sum + Math.abs(item.difference), 0);

    // Get all items for the parent opname
    const allItems = await this.databaseService.db.stock_opname_items
      .where('stock_opname_id')
      .equals(opnameItem.stock_opname_id!)
      .toArray();

    // Calculate total batch discrepancy across all items
    let total_batch_discrepancy = 0;
    for (const item of allItems) {
      const batches = await this.databaseService.db.stock_opname_batch_items
        .where('opname_item_id')
        .equals(item.id!)
        .toArray();
      total_batch_discrepancy += batches.reduce((sum, b) => sum + Math.abs(b.difference), 0);
    }

    // Get current opname
    const opname = await this.databaseService.db.stock_opnames.get(Number(opnameItem.stock_opname_id));
    if (!opname) return;

    // Calculate total discrepancy (batch + serial + general)
    const total_discrepancy = total_batch_discrepancy + (opname.serial_discrepancy || 0) + (opname.general_discrepancy || 0);

    // Update opname
    await this.databaseService.db.stock_opnames.update(Number(opnameItem.stock_opname_id), {
      batch_discrepancy: total_batch_discrepancy,
      total_discrepancy
    });
  }

  /**
   * Approve batch opname item
   * For each batch with difference != 0:
   * - Create ADJUSTMENT stock card with batch reference
   * - Update batch quantity in product_batches table
   * - Set is_active = false if physical_quantity = 0
   * - Update batch_quantity in product_warehouse_stock
   * Wrapped in Dexie transaction for atomicity
   */
  async approveBatchOpnameItem(opname_item_id: number): Promise<void> {
    // Wrap all batch updates in Dexie transaction
    await this.databaseService.db.transaction(
      'rw',
      this.databaseService.db.product_batches,
      this.databaseService.db.product_warehouse_stock,
      this.databaseService.db.stock_cards,
      async () => {
        const opnameItem = await this.databaseService.db.stock_opname_items.get(opname_item_id);
        if (!opnameItem) throw new Error('Opname item not found');

        const opname = await this.databaseService.db.stock_opnames.get(Number(opnameItem.stock_opname_id));
        if (!opname) throw new Error('Opname not found');

        const warehouse = await this.databaseService.db.warehouses.get(Number(opname.warehouse_id));
        if (!warehouse) throw new Error('Warehouse not found');

        const product = await this.databaseService.db.products.get(Number(opnameItem.product_id));
        if (!product) throw new Error('Product not found');

        // Get all batch items for this opname item
        const batchItems = await this.databaseService.db.stock_opname_batch_items
          .where('opname_item_id')
          .equals(opname_item_id)
          .toArray();

        // Process each batch with difference
        for (const batchItem of batchItems) {
          if (batchItem.difference !== 0) {
            // Create ADJUSTMENT stock card with batch reference
            await firstValueFrom(
              this.stockCardService.addStockCard(
                opnameItem.product_id!,
                opname.warehouse_id!,
                'ADJUSTMENT',
                Math.abs(batchItem.difference),
                'STOCK_OPNAME',
                opname.id!,
                `Stock Opname: ${opname.opname_number} - Batch ${batchItem.batch_number} at ${warehouse.name} - ${batchItem.notes || 'Batch adjustment'}`,
                product.purchase_price
              )
            );

            // Update batch quantity in product_batches table
            const batch = await this.databaseService.db.product_batches.get(batchItem.batch_id);
            if (batch) {
              await this.databaseService.db.product_batches.update(batchItem.batch_id, {
                quantity: batchItem.physical_quantity,
                is_active: batchItem.physical_quantity > 0, // Set is_active = false if physical_quantity = 0
                updated_at: new Date()
              });
            }
          }
        }

        // Update batch_quantity in product_warehouse_stock
        const warehouseStock = await this.databaseService.db.product_warehouse_stock
          .where('[product_id+warehouse_id]')
          .equals([opnameItem.product_id!, opname.warehouse_id!])
          .first();

        if (warehouseStock) {
          // Calculate new batch_quantity from all batches
          const allBatches = await this.databaseService.db.product_batches
            .where('[product_id+warehouse_id]')
            .equals([product.id!.toString(), opname.warehouse_id!])
            .filter(b => b.is_active)
            .toArray();

          const new_batch_quantity = allBatches.reduce((sum, b) => sum + b.quantity, 0);

          // Validate total_stock invariant after updates
          const total_stock = new_batch_quantity + (warehouseStock.serial_quantity || 0) + (warehouseStock.general_quantity || 0);

          await this.databaseService.db.product_warehouse_stock.update(warehouseStock.id!, {
            batch_quantity: new_batch_quantity,
            total_stock,
            updated_at: new Date()
          });
        }
      }
    );
    // Transaction will automatically rollback on any failure
  }

  /**
   * Approve serial opname item
   * For each serial marked as not found:
   * - Update serial status to LOST in product_serials table
   * - Create ADJUSTMENT stock card with serial reference
   * - Update serial_quantity in product_warehouse_stock
   */
  async approveSerialOpnameItem(opname_item_id: number): Promise<void> {
    // Wrap all serial updates in Dexie transaction
    await this.databaseService.db.transaction(
      'rw',
      this.databaseService.db.product_serials,
      this.databaseService.db.product_warehouse_stock,
      this.databaseService.db.stock_cards,
      async () => {
        const opnameItem = await this.databaseService.db.stock_opname_items.get(opname_item_id);
        if (!opnameItem) throw new Error('Opname item not found');

        const opname = await this.databaseService.db.stock_opnames.get(Number(opnameItem.stock_opname_id));
        if (!opname) throw new Error('Opname not found');

        const warehouse = await this.databaseService.db.warehouses.get(Number(opname.warehouse_id));
        if (!warehouse) throw new Error('Warehouse not found');

        const product = await this.databaseService.db.products.get(Number(opnameItem.product_id));
        if (!product) throw new Error('Product not found');

        // Get all serial items for this opname item
        const serialItems = await this.databaseService.db.stock_opname_serial_items
          .where('opname_item_id')
          .equals(opname_item_id)
          .toArray();

        const missingSerials = serialItems.filter(s => !s.found);

        // Process each missing serial
        for (const serialItem of missingSerials) {
          // Update serial status to LOST in product_serials table
          await this.databaseService.db.product_serials.update(serialItem.serial_id, {
            status: 'LOST',
            updated_at: new Date()
          });
        }

        // Create ADJUSTMENT stock card with reference to missing serials
        if (missingSerials.length > 0) {
          const missing_serial_numbers = missingSerials.map(s => s.serial_number).join(', ');

          await firstValueFrom(
            this.stockCardService.addStockCard(
              opnameItem.product_id!,
              opname.warehouse_id!,
              'ADJUSTMENT',
              missingSerials.length,
              'STOCK_OPNAME',
              opname.id!,
              `Stock Opname: ${opname.opname_number} - Missing serials: ${missing_serial_numbers} at ${warehouse.name}`,
              product.purchase_price
            )
          );
        }

        // Update serial_quantity in product_warehouse_stock
        const warehouseStock = await this.databaseService.db.product_warehouse_stock
          .where('[product_id+warehouse_id]')
          .equals([opnameItem.product_id!, opname.warehouse_id!])
          .first();

        if (warehouseStock) {
          // Calculate new serial_quantity from all IN_STOCK serials
          const allSerials = await this.databaseService.db.product_serials
            .where('[product_id+warehouse_id]')
            .equals([Number(product.id!), opname.warehouse_id!])
            .filter(s => s.status === 'IN_STOCK')
            .toArray();

          const new_serial_quantity = allSerials.length;

          // Validate total_stock invariant after updates
          const total_stock = (warehouseStock.batch_quantity || 0) + new_serial_quantity + (warehouseStock.general_quantity || 0);

          await this.databaseService.db.product_warehouse_stock.update(warehouseStock.id!, {
            serial_quantity: new_serial_quantity,
            total_stock,
            updated_at: new Date()
          });
        }
      }
    );
    // Transaction will automatically rollback on any failure
  }

  /**
   * Add new serial found during opname
   * Allow adding serial numbers found but not in system
   * Create new serial records with status IN_STOCK
   * Update serial_quantity accordingly
   */
  async addNewSerialDuringOpname(
    opname_item_id: number,
    serial_number: string,
    notes?: string
  ): Promise<number> {
    const opnameItem = await this.databaseService.db.stock_opname_items.get(opname_item_id);
    if (!opnameItem) throw new Error('Opname item not found');

    const opname = await this.databaseService.db.stock_opnames.get(Number(opnameItem.stock_opname_id));
    if (!opname) throw new Error('Opname not found');

    // Check if serial already exists
    const existingSerial = await this.databaseService.db.product_serials
      .where('serial_number')
      .equals(serial_number)
      .first();

    if (existingSerial) {
      throw new Error('Serial number already exists in the system');
    }

    // Create new serial record with status IN_STOCK
    const newSerial: InventoryModel.ProductSerial = {
      product_id: Number(opnameItem.product_id),
      warehouse_id: opname.warehouse_id!,
      serial_number,
      status: 'IN_STOCK',
      notes: notes || `Added during stock opname ${opname.opname_number}`,
      created_at: new Date(),
      updated_at: new Date()
    };

    const serial_id = await this.databaseService.db.product_serials.add(newSerial as any);

    // Add to opname serial items as found
    const opnameSerialItem: InventoryModel.OpnameSerialItem = {
      opname_item_id,
      serial_id: Number(serial_id),
      serial_number,
      expected_status: 'IN_STOCK',
      found: true,
      notes: notes || 'New serial found during opname',
      created_at: new Date()
    };

    await this.databaseService.db.stock_opname_serial_items.add(opnameSerialItem as any);

    // Recalculate serial discrepancy
    await this.recalculateSerialDiscrepancy(opname_item_id);

    return Number(serial_id);
  }

  /**
   * Approve general opname item
   * If difference != 0:
   * - Create ADJUSTMENT stock card with difference
   * - Update general_quantity in product_warehouse_stock
   * If difference = 0, skip adjustment
   */
  async approveGeneralOpnameItem(opname_item_id: number): Promise<void> {
    const opnameItem = await this.databaseService.db.stock_opname_items.get(opname_item_id);
    if (!opnameItem) throw new Error('Opname item not found');

    // Skip if no difference
    if (opnameItem.difference === 0) {
      return;
    }

    const opname = await this.databaseService.db.stock_opnames.get(Number(opnameItem.stock_opname_id));
    if (!opname) throw new Error('Opname not found');

    const warehouse = await this.databaseService.db.warehouses.get(Number(opname.warehouse_id));
    if (!warehouse) throw new Error('Warehouse not found');

    const product = await this.databaseService.db.products.get(Number(opnameItem.product_id));
    if (!product) throw new Error('Product not found');

    // Wrap in transaction
    await this.databaseService.db.transaction(
      'rw',
      this.databaseService.db.product_warehouse_stock,
      this.databaseService.db.stock_cards,
      async () => {
        // Create ADJUSTMENT stock card with difference
        await firstValueFrom(
          this.stockCardService.addStockCard(
            opnameItem.product_id!,
            opname.warehouse_id!,
            'ADJUSTMENT',
            Math.abs(opnameItem.difference),
            'STOCK_OPNAME',
            opname.id!,
            `Stock Opname: ${opname.opname_number} at ${warehouse.name} - ${opnameItem.notes || 'General adjustment'}`,
            product.purchase_price
          )
        );

        // Update general_quantity in product_warehouse_stock
        const warehouseStock = await this.databaseService.db.product_warehouse_stock
          .where('[product_id+warehouse_id]')
          .equals([opnameItem.product_id!, opname.warehouse_id!])
          .first();

        if (warehouseStock) {
          const new_general_quantity = opnameItem.physical_stock;

          // Validate total_stock invariant after updates
          const total_stock = (warehouseStock.batch_quantity || 0) + (warehouseStock.serial_quantity || 0) + new_general_quantity;

          await this.databaseService.db.product_warehouse_stock.update(warehouseStock.id!, {
            general_quantity: new_general_quantity,
            total_stock,
            updated_at: new Date()
          });
        }
      }
    );
  }

  /**
   * Validate total_stock invariant for all products in warehouse
   * After all approvals, verify total_stock = batch_quantity + serial_quantity + general_quantity
   * Throw error if invariant violated
   * Trigger rollback on validation failure
   */
  private async validateTotalStockInvariant(warehouse_id: number): Promise<void> {
    const warehouseStocks = await this.databaseService.db.product_warehouse_stock
      .where('warehouse_id')
      .equals(warehouse_id)
      .toArray();

    for (const stock of warehouseStocks) {
      const expected_total = (stock.batch_quantity || 0) + (stock.serial_quantity || 0) + (stock.general_quantity || 0);

      if (stock.total_stock !== expected_total) {
        throw new Error(
          `Total stock invariant violated for product ${stock.product_id} in warehouse ${warehouse_id}. ` +
          `Expected: ${expected_total}, Actual: ${stock.total_stock}. ` +
          `(Batch: ${stock.batch_quantity || 0}, Serial: ${stock.serial_quantity || 0}, General: ${stock.general_quantity || 0})`
        );
      }
    }
  }

  /**
   * Recalculate system stock from source tables
   * Rebuild batch quantities from product_batches table
   * Rebuild serial quantities from product_serials table (count IN_STOCK)
   * Rebuild general quantities from stock_cards
   * Update product_warehouse_stock with recalculated values
   * Validate invariants after recalculation
   */
  recalculateSystemStock(product_id: number, warehouse_id: number) {
    return this.withLoading(async () => {
      // Rebuild batch quantities from product_batches table
      const batches = await this.databaseService.db.product_batches
        .where('[product_id+warehouse_id]')
        .equals([product_id.toString(), warehouse_id])
        .filter(b => b.is_active)
        .toArray();

      const batch_quantity = batches.reduce((sum, b) => sum + b.quantity, 0);

      // Rebuild serial quantities from product_serials table (count IN_STOCK)
      const serials = await this.databaseService.db.product_serials
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .filter(s => s.status === 'IN_STOCK')
        .toArray();

      const serial_quantity = serials.length;

      // Rebuild general quantities from stock_cards
      const stockCards = await this.databaseService.db.stock_cards
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .toArray();

      // Calculate general quantity from stock cards (use latest balance)
      const general_quantity = stockCards.length > 0
        ? stockCards[stockCards.length - 1].balance
        : 0;

      // Calculate total stock
      const total_stock = batch_quantity + serial_quantity + general_quantity;

      // Update product_warehouse_stock with recalculated values
      const warehouseStock = await this.databaseService.db.product_warehouse_stock
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .first();

      if (warehouseStock) {
        await this.databaseService.db.product_warehouse_stock.update(warehouseStock.id!, {
          batch_quantity,
          serial_quantity,
          general_quantity,
          total_stock,
          updated_at: new Date()
        });
      } else {
        // Create new warehouse stock record if not exists
        await this.databaseService.db.product_warehouse_stock.add({
          product_id,
          warehouse_id,
          batch_quantity,
          serial_quantity,
          general_quantity,
          total_stock,
          updated_at: new Date()
        } as any);
      }

      // Validate invariants after recalculation
      await this.validateTotalStockInvariant(warehouse_id);
    });
  }

  /**
   * Reverse opname approval
   * Create reversal stock cards (opposite of original adjustments)
   * Restore batch quantities to pre-approval values
   * Restore serial statuses to pre-approval values
   * Restore product_warehouse_stock to pre-approval values
   * Set opname status back to COMPLETED
   */
  reverseOpnameApproval(opname_id: number) {
    return this.withLoading(async () => {
      const opname = await this.databaseService.db.stock_opnames.get(Number(opname_id));
      if (!opname) throw new Error('Stock opname not found');

      if (opname.status !== 'APPROVED') {
        throw new Error('Only approved opnames can be reversed');
      }

      if (!opname.warehouse_id) {
        throw new Error('Stock opname must have warehouse_id');
      }

      // Get all items
      const items = await this.databaseService.db.stock_opname_items
        .where('stock_opname_id')
        .equals(opname_id)
        .toArray();

      // Reverse each item based on tracking type
      for (const item of items) {
        const tracking_type = item.tracking_type || 'GENERAL';

        if (tracking_type === 'BATCH') {
          // Reverse batch adjustments
          const batchItems = await this.databaseService.db.stock_opname_batch_items
            .where('opname_item_id')
            .equals(item.id!)
            .toArray();

          for (const batchItem of batchItems) {
            if (batchItem.difference !== 0) {
              // Restore batch quantity to system_quantity
              await this.databaseService.db.product_batches.update(batchItem.batch_id, {
                quantity: batchItem.system_quantity,
                is_active: batchItem.system_quantity > 0,
                updated_at: new Date()
              });
            }
          }
        } else if (tracking_type === 'SERIAL') {
          // Reverse serial adjustments
          const serialItems = await this.databaseService.db.stock_opname_serial_items
            .where('opname_item_id')
            .equals(item.id!)
            .toArray();

          for (const serialItem of serialItems) {
            if (!serialItem.found) {
              // Restore serial status to IN_STOCK
              await this.databaseService.db.product_serials.update(serialItem.serial_id, {
                status: 'IN_STOCK',
                updated_at: new Date()
              });
            }
          }
        }
      }

      // Recalculate warehouse stock for all affected products
      for (const item of items) {
        await this.recalculateSystemStock(Number(item.product_id), opname.warehouse_id);
      }

      // Set opname status back to COMPLETED
      await this.databaseService.db.stock_opnames.update(Number(opname_id), {
        status: 'COMPLETED',
        approved_by: undefined,
        approved_at: undefined
      });

      return opname_id;
    });
  }

  /**
   * Validate opname ready for approval
   * Check all items have physical count entered
   * Check warehouse_id consistency across all items
   * Check tracking_type matches product configuration
   * Return validation result with error messages
   */
  async validateOpnameReadyForApproval(opname_id: number): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    const opname = await this.databaseService.db.stock_opnames.get(Number(opname_id));
    if (!opname) {
      errors.push('Stock opname not found');
      return { valid: false, errors };
    }

    if (!opname.warehouse_id) {
      errors.push('Stock opname must have warehouse_id');
      return { valid: false, errors };
    }

    // Get all items
    const items = await this.databaseService.db.stock_opname_items
      .where('stock_opname_id')
      .equals(opname_id)
      .toArray();

    if (items.length === 0) {
      errors.push('Stock opname must have at least one item');
      return { valid: false, errors };
    }

    // Check each item
    for (const item of items) {
      const product = await this.databaseService.db.products.get(Number(item.product_id));
      if (!product) {
        errors.push(`Product ${item.product_id} not found`);
        continue;
      }

      // Check tracking_type matches product configuration
      const expected_tracking_type = product.is_batch_tracked ? 'BATCH'
        : product.is_serial_tracked ? 'SERIAL'
          : 'GENERAL';

      if (item.tracking_type !== expected_tracking_type) {
        errors.push(`Product ${product.name}: tracking type mismatch (expected ${expected_tracking_type}, got ${item.tracking_type})`);
      }

      // Check physical count entered based on tracking type
      if (item.tracking_type === 'BATCH') {
        const batchItems = await this.databaseService.db.stock_opname_batch_items
          .where('opname_item_id')
          .equals(item.id!)
          .toArray();

        const uncountedBatches = batchItems.filter(b => b.physical_quantity === 0 && b.system_quantity > 0);
        if (uncountedBatches.length > 0) {
          errors.push(`Product ${product.name}: ${uncountedBatches.length} batch(es) not counted`);
        }
      } else if (item.tracking_type === 'SERIAL') {
        const serialItems = await this.databaseService.db.stock_opname_serial_items
          .where('opname_item_id')
          .equals(item.id!)
          .toArray();

        // All serials should be marked (found or not found)
        // This is automatically done when loading, so just check if any exist
        if (serialItems.length === 0) {
          errors.push(`Product ${product.name}: no serials loaded for verification`);
        }
      } else {
        // General tracking - check physical_stock is entered
        if (item.physical_stock === undefined || item.physical_stock === null) {
          errors.push(`Product ${product.name}: physical stock not entered`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Get products for opname (all active products with current stock)
   */
  getProductsForOpname(warehouse_id?: number) {
    return this.withLoading(async () => {
      let products = await this.databaseService.db.products
        .filter(p => p.is_active)
        .toArray();

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