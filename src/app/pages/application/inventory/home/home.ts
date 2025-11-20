import { Component, inject, OnInit } from '@angular/core';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { AvatarModule } from 'primeng/avatar';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { DashboardService } from '../../../../services/pages/application/human-resource/dashboard.service';
import { Store } from '@ngxs/store';
import { EmployeeState } from '../../../../store/human-resource/employee';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    DshBaseLayout,
    CurrencyPipe,
    DatePipe,
    ChartModule,
    DatePickerModule,
    AvatarModule,
    DynamicTable
  ],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  private _dashboardService = inject(DashboardService);
  private _store = inject(Store);

  Counting = {
    total_employee: 100,
    total_payroll: 120000000,
    total_departement: 5
  };

  WorkHoursChart = {
    datasource: [] as any,
    options: null as any
  };

  MonthlyInfo: any[] = [];

  TableProps: DynamicTableModel.ITable = {
    id: 'product',
    title: 'Daftar Produk',
    description: 'Daftar lengkap seluruh produk anda',
    column: [
      {
        id: 'employee_code',
        title: 'Kode Karyawan',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '200px'
      },
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        type: DynamicTableModel.IColumnType.TEXTWITHDESCRIPTION,
        description: 'email'
      },
      {
        id: 'phone_number',
        title: 'Nomor Telepon',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '180px'
      },
      {
        id: 'position.title',
        title: 'Posisi',
        type: DynamicTableModel.IColumnType.TEXT,
      },
      {
        id: 'department.title',
        title: 'Departemen',
        type: DynamicTableModel.IColumnType.BUTTON_ICON,
        button_icon: {
          title: 'department.title',
          icon_class: 'pi pi-circle-fill',
          icon_color: 'department.color',
          use_parsing_func: false,
        },
        width: '180px'
      },
      {
        id: 'employment_status',
        title: 'Status Kepegawaian',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '250px'
      },
      {
        id: 'created_at',
        title: 'Waktu Entry',
        type: DynamicTableModel.IColumnType.DATETIME,
        width: '200px'
      },
    ],
    datasource: [],
    filter: [
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'employee_code',
        title: 'Kode Karyawan',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'department_id',
        title: 'Departemen',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: '',
        select_props: {
          datasource: [],
          name: 'title',
          value: 'id'
        }
      },
      {
        id: 'work_status',
        title: 'Status Kerja',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: '',
        select_props: {
          datasource: [
            { id: 'active', title: 'Active' },
            { id: 'resigned', title: 'Resigned' },
            { id: 'suspended', title: 'Suspended' },
            { id: 'on-leave', title: 'On Leave' }
          ],
          name: 'title',
          value: 'id'
        }
      },
    ],
    sort: [
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        value: ''
      },
      {
        id: 'employee_code',
        title: 'Kode Karyawan',
        value: ''
      },
    ],
    toolbar: [
      { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
      { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
    ],
    paging: true,
    custom_button: [
      { id: 'add', title: 'Tambah', icon: 'pi pi-plus' }
    ]
  };

  ngOnInit(): void {
    this.initChart();

    this._dashboardService.getEmployeeCount().subscribe((count) => {
      this.Counting.total_employee = count;
    });

    this._dashboardService.getDepartmentCount().subscribe((count) => {
      this.Counting.total_departement = count;
    });

    this._dashboardService._totalPayroll.subscribe((result) => {
      this.Counting.total_payroll = result;
    });

    this._dashboardService._birthdayEmployees.subscribe((result) => {
      this.MonthlyInfo = result;
    });

    this._store
      .select(EmployeeState.getAll)
      .pipe(tap((result) => console.log(result)))
      .subscribe(result => this.TableProps.datasource = result.map((item: any) => {
        return {
          ...item,
          employment_status: item.employment_status ? (<String>item.employment_status).toUpperCase() : null
        }
      }));
  }

  private initChart() {
    this._dashboardService
      .getWorkingTimes('2025-11-01', '2025-11-10')
      .subscribe((result) => {
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--p-text-color');
        const textColorSecondary = getComputedStyle(document.documentElement).getPropertyValue('--p-text-muted-color');
        const surfaceBorder = getComputedStyle(document.documentElement).getPropertyValue('--p-content-border-color');

        this.WorkHoursChart.datasource = result;

        this.WorkHoursChart.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            },
            legend: {

              labels: {
                color: textColor
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
            y: {
              stacked: true,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            }
          }
        };
      });
  }
}
