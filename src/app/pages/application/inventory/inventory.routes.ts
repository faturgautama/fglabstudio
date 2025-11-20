import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: async () => (await import('./home/home')).Home,
        data: {
            icon: 'pi pi-objects-column',
            title: 'Dashboard',
            description: 'Welcome to Inventory App Code By Xerenity'
        }
    },
    {
        path: 'category',
        loadComponent: async () => (await import('./category/category')).Category,
        data: {
            icon: 'pi pi-tags',
            title: 'Kategori Produk',
            description: 'Manage dan atur semua data kategori produk'
        }
    },
    {
        path: 'product',
        loadComponent: async () => (await import('./product/product')).Product,
        data: {
            icon: 'pi pi-box',
            title: 'Produk',
            description: 'Manage dan atur semua data produk'
        }
    },
    {
        path: 'supplier',
        loadComponent: async () => (await import('./supplier/supplier')).Supplier,
        data: {
            icon: 'pi pi-building',
            title: 'Supplier',
            description: 'Manage dan atur semua data supplier'
        }
    },
    {
        path: 'warehouse',
        loadComponent: async () => (await import('./warehouse/warehouse')).Warehouse,
        data: {
            icon: 'pi pi-warehouse',
            title: 'Gudang',
            description: 'Manage dan atur semua data gudang'
        }
    },
    {
        path: 'purchase-order',
        loadComponent: async () => (await import('./purchase-order/purchase-order')).PurchaseOrder,
        data: {
            icon: 'pi pi-shopping-cart',
            title: 'Purchase Order',
            description: 'Manage dan atur semua data purchase order'
        }
    },
    {
        path: 'stock-card',
        loadComponent: async () => (await import('./stock-card/stock-card')).StockCard,
        data: {
            icon: 'pi pi-book',
            title: 'Kartu Stok',
            description: 'Lihat riwayat transaksi stok produk'
        }
    },
    {
        path: 'stock-movement',
        loadComponent: async () => (await import('./stock-movement/stock-movement')).StockMovement,
        data: {
            icon: 'pi pi-arrows-h',
            title: 'Stock Movement',
            description: 'Manage dan atur semua pergerakan stok'
        }
    },
    {
        path: 'stock-opname',
        loadComponent: async () => (await import('./stock-opname/stock-opname')).StockOpname,
        data: {
            icon: 'pi pi-list-check',
            title: 'Stock Opname',
            description: 'Manage dan atur semua data stock opname'
        }
    },
    {
        path: 'setting',
        loadComponent: async () => (await import('./company-setting/company-setting')).CompanySetting,
        data: {
            icon: 'pi pi-cog',
            title: 'Pengaturan Perusahaan',
            description: 'Manage dan atur data pengaturan perusahaan'
        }
    }
];
