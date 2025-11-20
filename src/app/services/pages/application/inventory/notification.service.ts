// src/app/services/pages/application/inventory/notification.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class NotificationService extends BaseActionService<InventoryModel.Notification> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.notifications;

    /**
     * Get unread notifications count
     */
    getUnreadCount() {
        return this.withLoading(async () => {
            return await this.databaseService.db.notifications
                .filter(n => !n.is_read)
                .count();
        });
    }

    /**
     * Mark as read
     */
    markAsRead(id: number) {
        return this.withLoading(async () => {
            return await this.databaseService.db.notifications.update(id, {
                is_read: true,
                read_at: new Date()
            });
        });
    }

    /**
     * Mark all as read
     */
    markAllAsRead() {
        return this.withLoading(async () => {
            const unread = await this.databaseService.db.notifications
                .filter(n => !n.is_read)
                .toArray();

            for (const notif of unread) {
                if (notif.id) {
                    await this.databaseService.db.notifications.update(notif.id, {
                        is_read: true,
                        read_at: new Date()
                    });
                }
            }
        });
    }

    /**
     * Create notification (override untuk custom logic)
     */
    override add(entity: InventoryModel.Notification) {
        const { id, ...payload } = {
            ...entity,
            created_at: new Date(),
            is_read: false
        };

        return this.withLoading(async () => await this.table.add(payload as any));
    }
}