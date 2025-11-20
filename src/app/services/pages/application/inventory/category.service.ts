// src/app/services/pages/application/inventory/category.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseActionService<InventoryModel.Category> {
  private databaseService = inject(DatabaseService);
  protected override table = this.databaseService.db.categories;
}