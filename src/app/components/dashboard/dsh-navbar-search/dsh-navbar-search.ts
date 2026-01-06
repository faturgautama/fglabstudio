import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Navigation } from '../../../services/components/navigation';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { EmployeeState } from '../../../store/human-resource/employee';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { PayrollState } from '../../../store/human-resource/payroll';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dsh-navbar-search',
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    TooltipModule,
    DialogModule,
    SelectButtonModule,
  ],
  templateUrl: './dsh-navbar-search.html',
  styleUrl: './dsh-navbar-search.scss',
  standalone: true,
})
export class DshNavbarSearch implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  _store = inject(Store);
  _router = inject(Router);
  _navigation = inject(Navigation);
  _cdr = inject(ChangeDetectorRef);

  menuDatasource = this._navigation.SidebarDashboardMenu();
  employeeDatasource: any[] = [];
  payrollDatasource: any[] = [];

  _showModal = false;

  searchBy = 'employee';
  searchValue = new BehaviorSubject<string>('');
  searchByOptions: any[] = [
    { id: 'employee', icon: 'pi pi-users', title: 'Employee' },
    { id: 'menu', icon: 'pi pi-bars', title: 'Menu' },
    { id: 'payroll', icon: 'pi pi-receipt', title: 'Payroll' },
  ];

  ngOnInit(): void {
    this.handleInitState();

    this.searchValue
      .pipe(
        takeUntil(this.Destroy$),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((result) => {
        if (result.length > 0) {
          this.handleInitState();
          this.handleFilter();
        } else {
          this.handleInitState();
        }
      });
  };

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  };

  handleInitState() {
    this.menuDatasource = this._navigation.SidebarDashboardMenu();

    this._store
      .select(EmployeeState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe((employees) => {
        this.employeeDatasource = employees;
      });

    this._store
      .select(PayrollState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(payrolls => this.payrollDatasource = payrolls);

    this._cdr.detectChanges();
  }

  handleChangeSelectType(event: any) {
    if (this.searchValue.getValue().length > 0) {
      this.handleFilter();
    } else {
      this.handleInitState();
    }
  }

  handleSearch(event?: any, value?: string) {
    const query = event ? event.target.value.toLowerCase() : value?.toLowerCase() || '';
    this.searchValue.next(query);
  }

  handleNavigate(type: string, id: string) {
    switch (type) {
      case 'employee':
        this._router.navigateByUrl(`/people/employee?id=${id}`);
        break;
      case 'payroll':
        this._router.navigateByUrl(`/people/payroll?id=${id}`);
        break;
      case 'menu':
        this._router.navigateByUrl(id);
        break;
      default:
        break
    }
  }

  handleFilter() {
    const query = this.searchValue.getValue();

    if (this.searchBy === 'employee') {
      const filteredEmployees = this.employeeDatasource.filter(emp =>
        emp.full_name.toLowerCase().includes(query)
      );

      this.employeeDatasource = filteredEmployees;
      this._cdr.detectChanges();
    }

    if (this.searchBy === 'payroll') {
      const filteredPayrolls = this.payrollDatasource.filter(payroll =>
        payroll.employees.full_name.toLowerCase().includes(query)
      );

      this.payrollDatasource = filteredPayrolls;
      this._cdr.detectChanges();
    }

    if (this.searchBy === 'menu') {
      const filteredMenus = this.menuDatasource.filter(menu =>
        menu.title.toLowerCase().includes(query) ||
        menu.path.toLowerCase().includes(query)
      );

      this.menuDatasource = filteredMenus;
      this._cdr.detectChanges();
    }
  }
}
