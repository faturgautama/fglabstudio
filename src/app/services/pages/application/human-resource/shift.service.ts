import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class ShiftService extends BaseActionService<EmployeeModel.IShift> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.shift;
} 
