import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { POSModel } from '../../../../model/pages/application/point-of-sales/pos.model';
import { BaseActionService } from '../../../shared/base-action';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class POSSettingService extends BaseActionService<POSModel.Setting> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.pos_settings;

    /**
     * Get current POS settings (first record)
     */
    getSettings() {
        return this.withLoading(async () => {
            const settings = await this.databaseService.db.pos_settings
                .filter(s => s.is_active !== false)
                .first();
            return settings || null;
        });
    }

    /**
     * Check if shift feature is enabled
     */
    isShiftEnabled() {
        return this.getSettings().pipe(
            map(settings => settings?.enable_shift ?? false)
        );
    }

    /**
     * Initialize default settings if not exists
     */
    initializeSettings() {
        return this.withLoading(async () => {
            const existing = await this.databaseService.db.pos_settings
                .filter(s => s.is_active !== false)
                .first();

            if (!existing) {
                const defaultSettings: POSModel.Setting = {
                    store_name: 'Toko Saya',
                    store_address: '',
                    store_phone: '',
                    transaction_prefix: 'TRX',
                    enable_shift: false,
                    is_active: true,
                    created_at: new Date()
                };
                return await this.databaseService.db.pos_settings.add(defaultSettings);
            }
            return existing.id;
        });
    }
}
