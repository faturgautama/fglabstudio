import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Navigation } from '../../../services/components/navigation';
import { SidebarModel } from '../../../model/components/dashboard/sidebar.model';

export const inventoryResolver: ResolveFn<any> = async (route) => {
    const service = inject(Navigation);

    const menu: SidebarModel.ISidebar[] = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: 'pi pi-objects-column',
            path: '/inventory/home'
        },
        {
            id: 'product',
            title: 'Produk',
            icon: 'pi pi-sitemap',
            path: '/inventory/product'
        },
        {
            id: 'warehouse',
            title: 'Warehouse',
            icon: 'pi pi-warehouse',
            path: '/inventory/warehouse'
        },
        {
            id: 'supplier',
            title: 'Supplier',
            icon: 'pi pi-truck',
            path: '/inventory/supplier'
        },
        {
            id: 'purchase-order',
            title: 'Purchase Order',
            icon: 'pi pi-paperclip',
            path: '/inventory/purchase-order'
        },
        {
            id: 'stock-movement',
            title: 'Stock Movement',
            icon: 'pi pi-arrows-alt',
            path: '/inventory/stock-movement'
        },
        {
            id: 'stock-opname',
            title: 'Stock Opname',
            icon: 'pi pi-calculator',
            path: '/inventory/stock-opname'
        },
        {
            id: 'stock-card',
            title: 'Stock Card',
            icon: 'pi pi-clipboard',
            path: '/inventory/stock-card'
        },
    ];

    service.setSidebarDashboardMenu(menu);

    return {
        extra_data: {
            title: 'Kategori Produk',
            routes: '/inventory/category',
            setting: '/inventory/setting'
        }
    };
};