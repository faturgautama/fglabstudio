import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Navigation } from '../../../services/components/navigation';
import { SidebarModel } from '../../../model/components/dashboard/sidebar.model';

export const posResolver: ResolveFn<any> = async (route) => {
    const service = inject(Navigation);

    const menu: SidebarModel.ISidebar[] = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: 'pi pi-chart-bar',
            path: '/point-of-sales/home'
        },
        {
            id: 'cashier',
            title: 'Kasir',
            icon: 'pi pi-shopping-cart',
            path: '/point-of-sales/cashier'
        },
        {
            id: 'product',
            title: 'Produk',
            icon: 'pi pi-box',
            path: '/point-of-sales/product'
        },
        {
            id: 'employee',
            title: 'Karyawan',
            icon: 'pi pi-users',
            path: '/point-of-sales/employee'
        },
        {
            id: 'history',
            title: 'Riwayat',
            icon: 'pi pi-history',
            path: '/point-of-sales/history'
        },
    ];

    service.setSidebarDashboardMenu(menu);

    return {
        extra_data: {
            title: 'Kategori Produk',
            routes: '/point-of-sales/category',
            setting: '/point-of-sales/setting',
            app_name: 'My POS'
        }
    };
};
