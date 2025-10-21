export namespace DynamicTableModel {
    export enum IColumnType {
        TEXT = 'text',
        NUMBER = 'number',
        CURRENCY = 'currency',
        DATE = 'date',
        DATETIME = 'datetime',
        ICON = 'icon',
        BADGE = 'badge',
        DROPDOWN = 'dropdown',
    }

    export interface IColumn {
        id: string;
        title: string;
        type: IColumnType;
        width?: string;
        badge_color?: () => {};
    }

    export interface IFilter {
        id: string;
        title: string;
        type: IColumnType;
        value?: string;
    }

    export interface ISort {
        id: string;
        title: string;
        value?: string;
    }

    export interface IToolbar {
        id: string;
        title: string;
        icon: string;
    }

    export interface ICustomButton {
        id: string;
        title: string;
        icon: string;
    }

    export interface ITable {
        id: string;
        title: string;
        description: string;
        column: IColumn[];
        datasource: any[];
        filter?: IFilter[];
        sort?: ISort[];
        toolbar?: IToolbar[];
        paging?: boolean;
        custom_button?: ICustomButton[];
    }
}