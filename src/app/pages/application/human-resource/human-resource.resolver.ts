import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Navigation } from '../../../services/components/navigation';
import { SidebarModel } from '../../../model/components/dashboard/sidebar.model';
import { DepartementModel } from '../../../model/pages/application/human-resource/department.model';

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
            id: 'employee',
            title: 'Pegawai',
            icon: 'pi pi-users',
            path: '/people/employee'
        },
        {
            id: 'absensi',
            title: 'Absensi',
            icon: 'pi pi-calendar',
            path: '/people/absensi'
        },
        {
            id: 'payroll',
            title: 'Payroll',
            icon: 'pi pi-receipt',
            path: '/people/payroll'
        },
        {
            id: 'jadwal',
            title: 'Jadwal',
            icon: 'pi pi-calendar',
            path: '/people/schedule'
        },
    ];

    const departement: DepartementModel.IDepartement[] = [
        {
            id: '1',
            title: 'Marketing',
            color: 'text-sky-500',
            is_active: true,
            created_at: new Date(),
            updated_at: null,
        },
        {
            id: '2',
            title: 'Finance',
            color: 'text-emerald-500',
            is_active: true,
            created_at: new Date(),
            updated_at: null,
        },
        {
            id: '3',
            title: 'Production',
            color: 'text-yellow-500',
            is_active: true,
            created_at: new Date(),
            updated_at: null,
        },
        {
            id: '4',
            title: 'Human Resource',
            color: 'text-red-500',
            is_active: true,
            created_at: new Date(),
            updated_at: null,
        },
        {
            id: '5',
            title: 'Engineering',
            color: 'text-blue-500',
            is_active: true,
            created_at: new Date(),
            updated_at: null,
        },
        {
            id: '6',
            title: 'Management',
            color: 'text-orange-500',
            is_active: true,
            created_at: new Date(),
            updated_at: null,
        },
    ];

    service.setSidebarDashboardMenu(menu);

    return {
        extra_data: {
            title: 'Departement',
            routes: '/people/departement',
            datasource: departement
        }
    };
};