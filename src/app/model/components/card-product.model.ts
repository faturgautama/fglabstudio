export namespace CardProductModel {
    export interface ICardProduct {
        id: number;
        title: string;
        description: string;
        image: string;
        images?: string[];
        price: number;
        discount_price: number;
        category: string;
        review?: ICardProductReview[];
        highlight?: string[];
        published_at: string;
        updated_at?: string;
        screenshots?: string[];
        version?: string;
        features?: IProductFeature[];
    }

    export enum ICardProductCategory {
        UI = 'UI/UX Design',
        WEB = 'Web Development',
        APP = 'Android / IOS Application',
        CUSTOM = 'Custom Enterprise Sysem'
    }

    export interface ICardProductReview {
        id: string;
        person_name: string;
        review: string;
        rating?: number;
        date?: string;
    }

    export interface IProductFeature {
        title: string;
        description: string;
        icon?: string;
    }
}