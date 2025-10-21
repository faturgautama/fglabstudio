export namespace EmployeeModel {
    export interface IBaseModel {
        id?: string | number;
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
        employee_code: string;
        full_name: string;
        nickname?: string;
        gender: 'male' | 'female' | 'other';
        email?: string;
        phone_number?: string;
        address?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        birth_date?: Date;
        join_date?: Date;
        resign_date?: Date | null;
        department_id?: string;
        position_id?: string;
        shift_id?: string;
        salary?: number;
        employment_status?: 'permanent' | 'contract' | 'intern';
        work_status?: 'active' | 'resigned' | 'suspended';
        is_remote?: boolean;
        emergency_contact?: {
            name: string;
            phone: string;
            relation: string;
        };
        photo_url?: string;
        is_active?: boolean;
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
