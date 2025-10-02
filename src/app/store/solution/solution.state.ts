import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { tap } from "rxjs";
import { CardServiceModel } from "../../model/components/card-service.model";
import { ServiceSolution } from "../../services/components/service-solution";
import { SolutionAction } from "./solution.action";

export interface SolutionStateModel {
    data: CardServiceModel.ICardService[];
}

@State<SolutionStateModel>({
    name: 'solution',
    defaults: {
        data: [],
    },
})
@Injectable()
export class SolutionState implements NgxsOnInit {

    constructor(
        private _serviceSolutionService: ServiceSolution
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new SolutionAction.GetSolution());
    }

    @Selector()
    static getData(state: SolutionStateModel) {
        return state.data;
    }

    @Action(SolutionAction.GetSolution)
    getProduct(ctx: StateContext<SolutionStateModel>) {
        return this._serviceSolutionService
            .getServiceSolution()
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