import { Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { from } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class ShiftService extends BaseActionService<EmployeeModel.IShift> {
    protected override table = db.shift;
} 
