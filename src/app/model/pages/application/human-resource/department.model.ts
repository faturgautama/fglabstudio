export namespace DepartementModel {
    export interface IDepartement {
        id: string;
        title: string;
        color: string;
        is_active: boolean;
        created_at: Date;
        updated_at?: Date | null;
    }
}