export namespace EmployeeModel {
    export interface IBaseModel {
        id?: any;
        created_at: Date;
        updated_at?: Date;
    }

    export interface IHumanResourceSetting extends IBaseModel {
        // Informasi Umum
        company_name: string;
        address: string;
        phone_number: string;
        fax_number: string;
        tax_number: string;
        effective_date: Date;
        is_active: boolean;

        // Tarif Lembur
        overtime_rate_per_hour: number; // contoh: 25000

        // Komponen Potongan Wajib
        has_bpjs_ketenagakerjaan: boolean;
        bpjs_ketenagakerjaan_employee: number; // 2%
        bpjs_ketenagakerjaan_company: number;  // 3.7%

        has_bpjs_pensiun: boolean;
        bpjs_pensiun_employee: number; // 1%
        bpjs_pensiun_company: number;  // 2%

        has_bpjs_kesehatan: boolean;
        bpjs_kesehatan_employee: number; // 1%
        bpjs_kesehatan_company: number;  // 4%

        // Pajak
        has_tax: boolean;
        tax_method: 'gross' | 'net' | 'gross-up'; // metode pajak PPh21
        tax_ptkp_type: 'TK0' | 'K0' | 'K1' | 'K2' | 'K3'; // kategori PTKP

        leave_policies?: ILeavePolicy[];
    }

    export interface ILeavePolicy extends IBaseModel {
        code: string;
        title: string;
        description?: string;
        leave_type: 'annual' | 'maternity' | 'paternity' | 'sick' | 'unpaid' | 'other';
        total_days: number;
        gender_restriction?: 'male' | 'female' | 'all';
        requires_approval: boolean;
        is_paid: boolean;
        is_active: boolean;
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

    export interface ILeave extends IBaseModel {
        employee_id: string;
        leave_policy_id: string; // relasi ke ILeavePolicy
        start_date: Date;
        end_date: Date;
        total_days: number;
        reason?: string;
        status: 'pending' | 'approved' | 'rejected' | 'cancelled';
        approved_by?: string;
        remarks?: string;
        is_delete: boolean;
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

    export interface IOvertime extends EmployeeModel.IBaseModel {
        employee_id: string;
        date: string;
        start_time: string;
        end_time: string;
        total_hours: number;

        // Jenis lembur: weekday, weekend, atau public holiday
        overtime_type: 'weekday' | 'weekend' | 'public-holiday';

        // Status approval
        status: 'pending' | 'approved' | 'rejected';

        // Catatan atau alasan lembur
        reason?: string;
        approved_by?: string;

        // Perhitungan lembur (dihitung otomatis saat generate payroll)
        calculated_pay?: number;

        is_delete?: boolean;
    }

    export interface IPayroll extends IBaseModel {
        employee_id: string;
        employees?: IEmployee;
        month: string;
        base_salary: number;
        overtime_pay?: number;
        bonus?: number;
        deduction?: number;
        net_salary: number;
        payment_status: 'pending' | 'paid';
        additional_allowances?: { name: string; amount: number }[];
        additional_deductions?: { name: string; amount: number }[];
        is_delete: boolean;
    }
}