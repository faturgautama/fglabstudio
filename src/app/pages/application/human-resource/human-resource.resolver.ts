import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Navigation } from '../../../services/components/navigation';
import { SidebarModel } from '../../../model/components/dashboard/sidebar.model';

export const humanResourceResolver: ResolveFn<any> = async (route) => {
    const service = inject(Navigation);

    const menu: SidebarModel.ISidebar[] = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: 'pi pi-objects-column',
            path: '/people/home'
        },
        {
            id: 'position',
            title: 'Posisi Jabatan',
            icon: 'pi pi-at',
            path: '/people/position'
        },
        {
            id: 'shift',
            title: 'Shift',
            icon: 'pi pi-hourglass',
            path: '/people/shift'
        },
        {
            id: 'employee',
            title: 'Pegawai',
            icon: 'pi pi-users',
            path: '/people/employee'
        },
        {
            id: 'attendance',
            title: 'Absensi',
            icon: 'pi pi-calendar',
            path: '/people/attendance'
        },
        {
            id: 'payroll',
            title: 'Payroll',
            icon: 'pi pi-receipt',
            path: '/people/payroll'
        },
        {
            id: 'schedule',
            title: 'Jadwal',
            icon: 'pi pi-calendar',
            path: '/people/schedule'
        },
    ];

    service.setSidebarDashboardMenu(menu);

    return {
        extra_data: {
            title: 'Departement',
            routes: '/people/departement',
            setting: '/people/setting'
        }
    };
};