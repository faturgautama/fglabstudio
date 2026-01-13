import { CardProductModel } from "../../model/components/card-product.model";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { ProductAction } from "./product.action";
import { Product } from "../../services/components/product";
import { tap } from "rxjs";

export interface ProductStateModel {
    data: CardProductModel.ICardProduct[];
    single: CardProductModel.ICardProduct | null;
    loading: boolean;
    error: string | null;
}

@State<ProductStateModel>({
    name: 'product',
    defaults: {
        data: [],
        single: null,
        loading: false,
        error: null
    },
})
@Injectable()
export class ProductState implements NgxsOnInit {

    constructor(
        private _productService: Product
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new ProductAction.GetProduct());
    }

    @Selector()
    static getData(state: ProductStateModel) {
        return state.data;
    }

    @Selector()
    static getProductById(state: ProductStateModel) {
        return (id: number) => {
            return state.data.find(product => product.id === id) || null;
        };
    }

    @Selector()
    static getSingleProduct(state: ProductStateModel) {
        return state.single;
    }

    @Action(ProductAction.GetProduct)
    getProduct(ctx: StateContext<ProductStateModel>) {
        return this._productService
            .getProduct()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result
                    })
                })
            )
    }

    @Action(ProductAction.SetSingleProduct)
    setSingleProduct(ctx: StateContext<ProductStateModel>, action: ProductAction.SetSingleProduct) {
        const state = ctx.getState();
        const product = state.data.find(p => p.id === action.productId) || null;
        ctx.patchState({
            single: product
        });
    }
}