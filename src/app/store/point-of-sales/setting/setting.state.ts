import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { POSSettingAction } from './setting.action';
import { tap, catchError, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { POSModel } from '../../../model/pages/application/point-of-sales/pos.model';
import { POSSettingService } from '../../../services/pages/application/point-of-sales/pos-setting.service';

export interface POSSettingStateModel {
    data: POSModel.Setting | null;
    loading: boolean;
    error: string | null;
}

@State<POSSettingStateModel>({
    name: 'posSetting',
    defaults: {
        data: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class POSSettingState implements NgxsOnInit {

    constructor(private _settingService: POSSettingService) { }

    ngxsOnInit(ctx: StateContext<POSSettingStateModel>): void {
        ctx.dispatch(new POSSettingAction.InitializeSetting());
    }

    @Selector()
    static getSetting(state: POSSettingStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: POSSettingStateModel) {
        return state.data;
    }

    @Selector()
    static isShiftEnabled(state: POSSettingStateModel) {
        return state.data?.enable_shift ?? false;
    }

    @Selector()
    static isLoading(state: POSSettingStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: POSSettingStateModel) {
        return state.error;
    }

    @Action(POSSettingAction.InitializeSetting)
    initializeSetting(ctx: StateContext<POSSettingStateModel>) {
        return this._settingService.initializeSettings().pipe(
            switchMap(() => ctx.dispatch(new POSSettingAction.GetSetting()))
        );
    }

    @Action(POSSettingAction.GetSetting)
    getSetting(ctx: StateContext<POSSettingStateModel>) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._settingService.getSettings().pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    data: result,
                    loading: false,
                    error: null
                });
            }),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal memuat pengaturan POS'
                });
                return of(null);
            })
        );
    }

    @Action(POSSettingAction.AddSetting)
    addSetting(ctx: StateContext<POSSettingStateModel>, action: POSSettingAction.AddSetting) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._settingService.add(action.payload).pipe(
            switchMap(() => ctx.dispatch(new POSSettingAction.GetSetting())),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal menyimpan pengaturan POS'
                });
                return of(null);
            })
        );
    }

    @Action(POSSettingAction.UpdateSetting)
    updateSetting(ctx: StateContext<POSSettingStateModel>, action: POSSettingAction.UpdateSetting) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._settingService.update(action.payload.id!, action.payload).pipe(
            switchMap(() => ctx.dispatch(new POSSettingAction.GetSetting())),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal menyimpan pengaturan POS'
                });
                return of(null);
            })
        );
    }
}
