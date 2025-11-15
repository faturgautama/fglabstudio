import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { Subject, takeUntil, tap } from 'rxjs';
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

  menuDatasource = this._navigation.SidebarDashboardMenu();
  employeeDatasource: any[] = [];
  payrollDatasource: any[] = [];

  _showModal = false;

  searchBy: string = 'employee';
  searchByOptions: any[] = [
    { id: 'employee', icon: 'pi pi-users', title: 'Employee' },
    { id: 'menu', icon: 'pi pi-bars', title: 'Menu' },
    { id: 'payroll', icon: 'pi pi-receipt', title: 'Payroll' },
  ];

  ngOnInit(): void {
    this._store
      .select(EmployeeState.getAll)
      .pipe(takeUntil(this.Destroy$), tap((result) => console.log(result)))
      .subscribe(employees => this.employeeDatasource = employees);

    this._store
      .select(PayrollState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(payrolls => this.payrollDatasource = payrolls);
  };

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  };


}
