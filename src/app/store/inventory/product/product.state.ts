// src/app/store/inventory/product/product.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { ProductAction } from "./product.action";
import { tap, catchError, switchMap, map } from "rxjs";
import { of } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { ProductService } from "../../../services/pages/application/inventory/product.service";

export interface ProductStateModel {
    data: InventoryModel.Product[];
    single: InventoryModel.Product | null | undefined;
    lowStockProducts: InventoryModel.Product[];
    searchResults: InventoryModel.Product[];
    generatedSKU: string | null;
    totalInventoryValue: number;
    error: string | null;
    loading: boolean;
}

@State<ProductStateModel>({
    name: 'inventoryProduct',
    defaults: {
        data: [],
        single: null,
        lowStockProducts: [],
        searchResults: [],
        generatedSKU: null,
        totalInventoryValue: 0,
        error: null,
        loading: false
    },
})
@Injectable()
export class ProductState implements NgxsOnInit {

    constructor(
        private _productService: ProductService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new ProductAction.GetProduct());
        ctx.dispatch(new ProductAction.GetLowStockProducts());
    }

    @Selector()
    static getAll(state: ProductStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: ProductStateModel) {
        return state.single;
    }

    @Selector()
    static getLowStockProducts(state: ProductStateModel) {
        return state.lowStockProducts;
    }

    @Selector()
    static getSearchResults(state: ProductStateModel) {
        return state.searchResults;
    }

    @Selector()
    static getGeneratedSKU(state: ProductStateModel) {
        return state.generatedSKU;
    }

    @Selector()
    static getTotalInventoryValue(state: ProductStateModel) {
        return state.totalInventoryValue;
    }

    @Selector()
    static getError(state: ProductStateModel) {
        return state.error;
    }

    @Selector()
    static isLoading(state: ProductStateModel) {
        return state.loading;
    }

    @Action(ProductAction.GetProduct)
    getProduct(ctx: StateContext<ProductStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._productService
            .getAll(payload.filter, payload.sort)
            .pipe(
                switchMap((result) => {
                    // Get total inventory value
                    return this._productService.getTotalInventoryValue().pipe(
                        map((totalValue) => ({ result, totalValue }))
                    );
                }),
                tap(({ result, totalValue }) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result,
                        totalInventoryValue: totalValue,
                        loading: false,
                        error: null
                    });
                }),
                catchError((err: any) => {
                    console.error('❌ Error fetching products:', err);
                    ctx.setState({
                        ...state,
                        loading: false,
                        error: err?.message || 'Gagal memuat data produk'
                    });
                    return of(null);
                })
            );
    }

    @Action(ProductAction.GetByIdProduct)
    getById(ctx: StateContext<ProductStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._productService
            .getById(payload.id)
            .pipe(
                tap((result) => {
                    ctx.setState({
                        ...state,
                        single: result,
                        loading: false,
                        error: null
                    });
                }),
                catchError((err: any) => {
                    console.error('❌ Error fetching product:', err);
                    ctx.setState({
                        ...state,
                        loading: false,
                        error: err?.message || 'Gagal memuat data produk'
                    });
                    return of(null);
                })
            );
    }

    @Action(ProductAction.AddProduct)
    add(ctx: StateContext<ProductStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._productService
            .add(payload.payload)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts()
                    ]);
                })
            );
    }

    @Action(ProductAction.UpdateProduct)
    update(ctx: StateContext<ProductStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._productService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts()
                    ]);
                })
            );
    }

    @Action(ProductAction.DeleteProduct)
    delete(ctx: StateContext<ProductStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._productService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new ProductAction.GetProduct()))
            );
    }

    @Action(ProductAction.GetLowStockProducts)
    getLowStockProducts(ctx: StateContext<ProductStateModel>) {
        return this._productService
            .getLowStockProducts()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        lowStockProducts: result
                    });
                })
            );
    }

    @Action(ProductAction.SearchProducts)
    searchProducts(ctx: StateContext<ProductStateModel>, payload: any) {
        return this._productService
            .searchProducts(payload.keyword)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        searchResults: result
                    });
                })
            );
    }

    @Action(ProductAction.GenerateSKU)
    generateSKU(ctx: StateContext<ProductStateModel>, payload: any) {
        return this._productService
            .generateSKU(payload.categoryCode)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        generatedSKU: result
                    });
                })
            );
    }

    @Action(ProductAction.UpdateStock)
    updateStock(ctx: StateContext<ProductStateModel>, payload: any) {
        return this._productService
            .updateStock(Number(payload.id), payload.quantity)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts()
                    ]);
                })
            );
    }
}