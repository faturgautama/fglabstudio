// src/app/store/inventory/notification/notification.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace NotificationAction {
    export class AddNotification {
        static readonly type = '[Inventory Notification] Add';
        constructor(public payload: InventoryModel.Notification) { }
    }

    export class GetNotification {
        static readonly type = '[Inventory Notification] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdNotification {
        static readonly type = '[Inventory Notification] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateNotification {
        static readonly type = '[Inventory Notification] Update';
        constructor(public payload: InventoryModel.Notification) { }
    }

    export class DeleteNotification {
        static readonly type = '[Inventory Notification] Delete';
        constructor(public id: string) { }
    }

    export class MarkAsRead {
        static readonly type = '[Inventory Notification] Mark As Read';
        constructor(public id: string) { }
    }

    export class MarkAllAsRead {
        static readonly type = '[Inventory Notification] Mark All As Read';
    }

    export class GetUnreadCount {
        static readonly type = '[Inventory Notification] Get Unread Count';
    }
}