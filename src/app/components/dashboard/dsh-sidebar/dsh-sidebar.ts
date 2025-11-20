import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Navigation } from '../../../services/components/navigation';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { SidebarModel } from '../../../model/components/dashboard/sidebar.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DepartementState } from '../../../store/human-resource/departement';
import { CompanySettingState } from '../../../store/human-resource/company-setting';
import { EmployeeModel } from '../../../model/pages/application/human-resource/employee.model';
import { EmployeeState } from '../../../store/human-resource/employee';
import { CategoryState } from '../../../store/inventory';
import { ProductState } from '../../../store/product';

@Component({
  selector: 'app-dsh-sidebar',
  imports: [
    ButtonModule,
  ],
  standalone: true,
  templateUrl: './dsh-sidebar.html',
  styleUrl: './dsh-sidebar.scss'
})
export class DshSidebar implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  _appName = 'Inventory Management';

  _navigationService = inject(Navigation);

  toggleSidebar = false;

  sidebarMenu: SidebarModel.ISidebar[] = this._navigationService.SidebarDashboardMenu();

  resolverExtraData: any = null;

  _settingUrl = '';

  _companySetting!: EmployeeModel.IHumanResourceSetting | null | undefined;

  constructor(
    private _store: Store,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._navigationService
      .toggleDashboardSidebar
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        this.toggleSidebar = result;
      });

    this._activatedRoute
      .data
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        this.resolverExtraData = result['resolver']['extra_data'];
        this._settingUrl = this.resolverExtraData.setting;
      });
  }

  ngOnInit(): void {
    if (this.resolverExtraData.title == 'Departement') {
      this._appName = 'My People';
      this.getHumanResourceState();
    };

    if (this.resolverExtraData.title == 'Kategori Produk') {
      this._appName = 'My Inventory';
      this.getInventoryState();
    }
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleToggleSidebar() {
    const currentState = this._navigationService.toggleDashboardSidebar.value;
    this._navigationService.toggleDashboardSidebar.next(!currentState);
  }

  handleClickMenu(item: SidebarModel.ISidebar) {
    this._router.navigateByUrl(item.path);
  }

  handleClickExtraData(item?: any) {
    if (item) {
      this._router.navigateByUrl(`${this.resolverExtraData.routes}?id=${item.id}`);
    } else {
      this._router.navigateByUrl(`${this.resolverExtraData.routes}`);
    }
  }

  handleClickSetting() {
    this._router.navigateByUrl(this._settingUrl);
  }

  private getHumanResourceState() {
    this._store.select(DepartementState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.resolverExtraData.datasource = result);

    this._store.select(CompanySettingState.getSingle)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.resolverExtraData.company_setting = result);

    this._store.select(EmployeeState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.resolverExtraData.employee_count = result.length);
  }

  private getInventoryState() {
    this._store.select(CategoryState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.resolverExtraData.datasource = result);

    this._store.select(CompanySettingState.getSingle)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.resolverExtraData.company_setting = result);

    this._store.select(ProductState.getData)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.resolverExtraData.product_count = result.length);
  }
}
