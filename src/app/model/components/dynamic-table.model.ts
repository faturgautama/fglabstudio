export namespace DynamicTableModel {
    export enum IColumnType {
        TEXT = 'text',
        TEXTWITHDESCRIPTION = 'textwithdescription',
        NUMBER = 'number',
        CURRENCY = 'currency',
        DATE = 'date',
        DATETIME = 'datetime',
        DATERANGE = 'daterange',
        ICON = 'icon',
        BUTTON_ICON = 'button_icon',
        BADGE = 'badge',
        DROPDOWN = 'dropdown',
    }

    export interface ISelectProps {
        name: string;
        value: string;
        datasource: any[];
    }

    export interface IButtonIcon {
        title: string;
        icon_class: string;
        icon_color: string;
        use_parsing_func: boolean;
    }

    export interface IColumn {
        id: string;
        title: string;
        type: IColumnType;
        width?: string;
        button_icon?: IButtonIcon;
        description?: string;
    }

    export interface IFilter {
        id: string;
        title: string;
        type: IColumnType;
        value?: string;
        select_props?: ISelectProps;
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