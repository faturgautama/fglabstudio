// src/app/store/inventory/notification/notification.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { NotificationAction } from "./notification.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { NotificationService } from "../../../services/pages/application/inventory/notification.service";

export interface NotificationStateModel {
    data: InventoryModel.Notification[];
    single: InventoryModel.Notification | null | undefined;
    unreadCount: number;
}

@State<NotificationStateModel>({
    name: 'inventoryNotification',
    defaults: {
        data: [],
        single: null,
        unreadCount: 0
    },
})
@Injectable()
export class NotificationState implements NgxsOnInit {

    constructor(
        private _notificationService: NotificationService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new NotificationAction.GetNotification());
        ctx.dispatch(new NotificationAction.GetUnreadCount());
    }

    @Selector()
    static getAll(state: NotificationStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: NotificationStateModel) {
        return state.single;
    }

    @Selector()
    static getUnreadCount(state: NotificationStateModel) {
        return state.unreadCount;
    }

    @Action(NotificationAction.GetNotification)
    getNotification(ctx: StateContext<NotificationStateModel>, payload: any) {
        return this._notificationService
            .getAll(payload?.filter, payload?.sort)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result
                    });
                }),
            );
    }

    @Action(NotificationAction.GetByIdNotification)
    getById(ctx: StateContext<NotificationStateModel>, payload: any) {
        return this._notificationService
            .getById(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result
                    });
                })
            );
    }

    @Action(NotificationAction.AddNotification)
    add(ctx: StateContext<NotificationStateModel>, payload: any) {
        return this._notificationService
            .add(payload.payload)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new NotificationAction.GetNotification(),
                        new NotificationAction.GetUnreadCount()
                    ]);
                })
            );
    }

    @Action(NotificationAction.UpdateNotification)
    update(ctx: StateContext<NotificationStateModel>, payload: any) {
        return this._notificationService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new NotificationAction.GetNotification()))
            );
    }

    @Action(NotificationAction.DeleteNotification)
    delete(ctx: StateContext<NotificationStateModel>, payload: any) {
        return this._notificationService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new NotificationAction.GetNotification()))
            );
    }

    @Action(NotificationAction.MarkAsRead)
    markAsRead(ctx: StateContext<NotificationStateModel>, payload: any) {
        return this._notificationService
            .markAsRead(Number(payload.id))
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new NotificationAction.GetNotification(),
                        new NotificationAction.GetUnreadCount()
                    ]);
                })
            );
    }

    @Action(NotificationAction.MarkAllAsRead)
    markAllAsRead(ctx: StateContext<NotificationStateModel>) {
        return this._notificationService
            .markAllAsRead()
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new NotificationAction.GetNotification(),
                        new NotificationAction.GetUnreadCount()
                    ]);
                })
            );
    }

    @Action(NotificationAction.GetUnreadCount)
    getUnreadCount(ctx: StateContext<NotificationStateModel>) {
        return this._notificationService
            .getUnreadCount()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        unreadCount: result
                    });
                })
            );
    }
}