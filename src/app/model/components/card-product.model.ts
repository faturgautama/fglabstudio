export namespace CardProductModel {
    export interface ICardProduct {
        id: string;
        title: string;
        description: string;
        image: string;
        price: number;
        discount_price: number;
        category: string;
        review?: ICardProductReview[];
        highlight?: string[];
        published_at: string;
        updated_at?: string;
    }

    export enum ICardProductCategory {
        UI ='UI/UX Design',
        WEB = 'Web Development',
        APP = 'Android / IOS Application',
        CUSTOM = 'Custom Enterprise Sysem'
    }

    export interface ICardProductReview {
        id: string;
        person_name: string;
        review: string;
    }
}