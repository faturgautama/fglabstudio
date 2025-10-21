import { Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class DepartmentService extends BaseActionService<EmployeeModel.IDepartment> {
    protected override table = db.department;
}
