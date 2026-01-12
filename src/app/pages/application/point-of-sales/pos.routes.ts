import { Routes } from '@angular/router';

export const posRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: async () => (await import('./home/home')).Home,
        data: {
            icon: 'pi pi-chart-bar',
            title: 'Dashboard',
            description: 'Dashboard POS Kasir'
        }
    },
    {
        path: 'cashier',
        loadComponent: async () => (await import('./cashier/cashier')).Cashier,
        data: {
            icon: 'pi pi-shopping-cart',
            title: 'Kasir',
            description: 'Halaman transaksi kasir'
        }
    },
    {
        path: 'product',
        loadComponent: async () => (await import('../inventory/product/product')).Product,
        data: {
            icon: 'pi pi-box',
            title: 'Produk',
            description: 'Manage dan atur semua data produk'
        }
    },
    {
        path: 'category',
        loadComponent: async () => (await import('../inventory/category/category')).Category,
        data: {
            icon: 'pi pi-tags',
            title: 'Kategori Produk',
            description: 'Manage dan atur kategori produk'
        }
    },
    {
        path: 'employee',
        loadComponent: async () => (await import('../human-resource/employee/employee')).Employee,
        data: {
            icon: 'pi pi-users',
            title: 'Karyawan',
            description: 'Manage dan atur semua data karyawan'
        }
    },
    {
        path: 'history',
        loadComponent: async () => (await import('./history/history')).History,
        data: {
            icon: 'pi pi-history',
            title: 'Riwayat Transaksi',
            description: 'Lihat riwayat transaksi penjualan'
        }
    },
    {
        path: 'setting',
        loadComponent: async () => (await import('./setting/setting')).Setting,
        data: {
            icon: 'pi pi-cog',
            title: 'Pengaturan',
            description: 'Pengaturan POS Kasir'
        }
    }
];
