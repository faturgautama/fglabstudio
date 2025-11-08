import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { from } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';

@Injectable({ providedIn: 'root' })
export class CompanySettingService {

    private databaseService = inject(DatabaseService);

    add(setting: EmployeeModel.IHumanResourceSetting) {
        setting.created_at = new Date();
        return from(this.databaseService.db.hr_setting.add(setting as any));
    }

    getAll() {
        return from(this.databaseService.db.hr_setting.toArray());
    }

    getById(id: number | string) {
        return from(this.databaseService.db.hr_setting.get(id as any));
    }

    update(id: number | string, changes: Partial<EmployeeModel.IHumanResourceSetting>) {
        changes.updated_at = new Date();
        return from(this.databaseService.db.hr_setting.update(id as any, changes as any));
    }

    delete(id: number | string) {
        return from(this.databaseService.db.hr_setting.delete(id as any));
    }

    clear() {
        return from(this.databaseService.db.hr_setting.clear());
    }
}
