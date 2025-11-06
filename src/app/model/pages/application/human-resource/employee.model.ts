export namespace EmployeeModel {
    export interface IBaseModel {
        id?: any;
        created_at: Date;
        updated_at?: Date;
    }

    export interface IDepartment extends IBaseModel {
        code: string;
        title: string;
        description?: string;
        color?: string;
        is_active: boolean;
    }

    export interface IPosition extends IBaseModel {
        code: string;
        title: string;
        description?: string;
        department_id: string;
        level?: number;
        salary_range_min?: number;
        salary_range_max?: number;
        is_active: boolean;
    }

    export interface IEmployee extends IBaseModel {
        // Identitas Dasar
        employee_code: string;
        full_name: string;
        nickname?: string;
        gender: 'male' | 'female' | 'other';

        // Informasi Kontak
        email?: string;
        phone_number?: string;
        address?: string;
        city?: string;
        province?: string;
        postal_code?: string;

        // Informasi Personal
        birth_date?: Date;
        age?: number; // Dihitung dari birth_date
        blood_type?: 'A' | 'B' | 'AB' | 'O';
        marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
        number_of_dependents?: number;
        id_card_number?: string; // NIK/Nomor Identitas
        id_card_expiry?: Date;
        passport_number?: string;
        passport_expiry?: Date;

        // Informasi Pekerjaan
        department_id?: string;
        position_id?: string;
        shift_id?: string;
        employee_type?: 'full-time' | 'part-time' | 'contract' | 'intern';
        employment_status?: 'permanent' | 'contract' | 'intern';
        work_status?: 'active' | 'resigned' | 'suspended' | 'on-leave';
        join_date?: Date;
        resign_date?: Date | null;
        probation_end_date?: Date;

        // Informasi Kompensasi
        salary?: number;
        salary_currency?: string; // IDR, USD, dll
        bank_account_number?: string;
        bank_account_name?: string;
        bank_name?: string;
        tax_id?: string; // NPWP

        // Informasi Lokasi Kerja
        is_remote?: boolean;
        office_location?: string;
        workstation_number?: string;

        // Kontak Darurat
        emergency_contact?: {
            name: string;
            phone: string;
            relation: string;
            address?: string;
        };

        // Informasi Tambahan
        photo_url?: string;
        cv_url?: string;
        certificate_urls?: string[]; // URL sertifikat/ijazah
        skills?: string[]; // Keahlian/skill
        notes?: string; // Catatan tambahan

        // Status
        is_active?: boolean;
        is_verified?: boolean; // Verifikasi dokumen
        last_login?: Date;
    }

    export interface IShift extends IBaseModel {
        code: string;
        title: string;
        start_time: string;
        end_time: string;
        break_duration?: number;
        is_active: boolean;
    }

    export interface IAttendance extends IBaseModel {
        employee_id: string;
        shift_id: string;
        date: string;
        check_in?: string;
        check_out?: string;
        work_hours?: number;
        overtime_hours?: number;
        is_late?: boolean;
        is_present: boolean;
        is_delete: boolean;
        description?: string;
    }

    export interface IPayroll extends IBaseModel {
        employee_id: string;
        month: string;
        base_salary: number;
        overtime_pay?: number;
        bonus?: number;
        deduction?: number;
        net_salary: number;
        payment_status: 'pending' | 'paid';
        is_delete: boolean;
    }
}


