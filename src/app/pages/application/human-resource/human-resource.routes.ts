import { Routes } from '@angular/router';

export const humanResourceRoutes: Routes = [
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
            description: 'Welcome to People HR App Code By Xerenity'
        }
    },
    {
        path: 'position',
        loadComponent: async () => (await import('./position/position')).Position,
        data: {
            icon: 'pi pi-at',
            title: 'Posisi Jabatan',
            description: 'Manage dan atur semua data posisi jabatan'
        }
    },
    {
        path: 'departement',
        loadComponent: async () => (await import('./departement/departement')).Departement,
        data: {
            icon: 'pi pi-users',
            title: 'Departement',
            description: 'Manage dan atur semua data departemen'
        }
    },
    {
        path: 'shift',
        loadComponent: async () => (await import('./shift/shift')).Shift,
        data: {
            icon: 'pi pi-hourglass',
            title: 'Shift',
            description: 'Manage dan atur semua data shift'
        }
    },
    {
        path: 'employee',
        loadComponent: async () => (await import('./employee/employee')).Employee,
        data: {
            icon: 'pi pi-users',
            title: 'Karyawan',
            description: 'Manage dan atur semua data karyawan'
        }
    },
    {
        path: 'attendance',
        loadComponent: async () => (await import('./attendance/attendance')).Attendance,
        data: {
            icon: 'pi pi-calendar',
            title: 'Absensi',
            description: 'Manage dan atur semua data absensi karyawan'
        }
    },
    {
        path: 'leave',
        loadComponent: async () => (await import('./leave/leave')).Leave,
        data: {
            icon: 'pi pi-calendar-times',
            title: 'Cuti',
            description: 'Manage dan atur semua data pengajuan cuti karyawan'
        }
    },
    {
        path: 'overtime',
        loadComponent: async () => (await import('./overtime/overtime')).Overtime,
        data: {
            icon: 'pi pi-clock',
            title: 'Lembur',
            description: 'Manage dan atur semua data pengajuan lembur karyawan'
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
