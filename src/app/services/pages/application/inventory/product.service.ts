// src/app/services/pages/application/inventory/product.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';
import { from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseActionService<InventoryModel.Product> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.products;

    /**
     * Generate SKU otomatis berdasarkan prefix company
     */
    generateSKU(categoryCode?: string) {
        return this.withLoading(async () => {
            const company = await this.databaseService.db.inventory_setting.toCollection().first();
            const prefix = company?.sku_prefix || 'PRD';
            const count = await this.databaseService.db.products.count();

            const categoryPrefix = categoryCode ? `${categoryCode}-` : '';
            return `${prefix}-${categoryPrefix}${String(count + 1).padStart(5, '0')}`;
        });
    }

    /**
     * Get products dengan stok rendah (current_stock <= min_stock)
     */
    getLowStockProducts() {
        return this.withLoading(async () => {
            const products = await this.databaseService.db.products
                .filter(p => p.current_stock <= p.min_stock && p.is_active)
                .toArray();

            return this.resolveMultipleRelations(products);
        });
    }

    /**
     * Get products by category
     */
    getProductsByCategory(category_id: string) {
        return this.getAllByColumn('category_id' as keyof InventoryModel.Product, category_id);
    }

    /**
     * Search products by name, SKU, or barcode
     */
    searchProducts(keyword: string) {
        return this.withLoading(async () => {
            const lowerKeyword = keyword.toLowerCase();

            const products = await this.databaseService.db.products
                .filter((p: any) =>
                    p.is_active &&
                    (p.name.toLowerCase().includes(lowerKeyword) ||
                        p.sku.toLowerCase().includes(lowerKeyword) ||
                        (p.barcode && p.barcode.toLowerCase().includes(lowerKeyword)))
                )
                .toArray();

            return this.resolveMultipleRelations(products);
        });
    }

    /**
     * Calculate total inventory value
     */
    getTotalInventoryValue() {
        return this.withLoading(async () => {
            const products = await this.databaseService.db.products
                .filter(p => p.is_active)
                .toArray();

            return products.reduce((sum, p) =>
                sum + (p.current_stock * p.purchase_price), 0
            );
        });
    }

    /**
     * Update stock product
     */
    updateStock(id: number, quantity: number) {
        return this.withLoading(async () => {
            const product = await this.databaseService.db.products.get(id);
            if (!product) throw new Error('Product not found');

            const new_stock = product.current_stock + quantity;
            return await this.databaseService.db.products.update(id, {
                current_stock: new_stock,
                updated_at: new Date()
            });
        });
    }

    /**
     * Check if product needs reorder
     */
    checkReorderPoint(product_id: number) {
        return this.withLoading(async () => {
            const product = await this.databaseService.db.products.get(product_id);
            if (!product) return false;

            return product.reorder_point
                ? product.current_stock <= product.reorder_point
                : product.current_stock <= product.min_stock;
        });
    }

    override async resolveMultipleRelations(records: InventoryModel.Product[]): Promise<any[]> {
        return Promise.all(records.map(record => this.resolveRelations(record)));
    }

    override async resolveRelations(record: InventoryModel.Product): Promise<any> {
        const enriched: any = { ...record };

        // Resolve category
        if (record.category_id) {
            const category = await this.databaseService.db.categories.get(Number(record.category_id));
            if (category) enriched.category = category;
        }

        // Resolve default supplier
        if (record.default_supplier_id) {
            const supplier = await this.databaseService.db.suppliers.get(Number(record.default_supplier_id));
            if (supplier) enriched.supplier = supplier;
        }

        return enriched;
    }
}