import { CardProductModel } from "../../model/components/card-product.model";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { ProductAction } from "./product.action";
import { Product } from "../../services/components/product";
import { tap } from "rxjs";

export interface ProductStateModel {
    data: CardProductModel.ICardProduct[];
    single: CardProductModel.ICardProduct | null;
}

@State<ProductStateModel>({
    name: 'product',
    defaults: {
        data: [],
        single: null
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
}