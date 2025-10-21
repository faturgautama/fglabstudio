import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { AvatarModule } from 'primeng/avatar';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';

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
  Counting = {
    total_employee: 100,
    total_payroll: 120000000,
    total_departement: 5
  };

  WorkHoursChart = {
    datasource: [] as any,
    options: null as any
  };

  MonthlyInfo = [
    {
      id: 1,
      full_name: 'Lalisa Manobal',
      birthday: new Date('2025-10-10')
    },
    {
      id: 2,
      full_name: 'Kim Jisoo',
      birthday: new Date('2025-10-18')
    },
    {
      id: 3,
      full_name: 'Park Rose',
      birthday: new Date('2025-10-25')
    },
  ];

  TableProps: DynamicTableModel.ITable = {
    id: 'employee',
    title: 'Daftar Karyawan',
    description: 'Daftar karyawan aktif perusahaan',
    column: [
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '200px'
      },
      {
        id: 'departement',
        title: 'Departemen',
        type: DynamicTableModel.IColumnType.BADGE,
        width: '200px'
      },
      {
        id: 'gender',
        title: 'Gender',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '200px'
      },
      {
        id: 'employment_status',
        title: 'Status Kepegawaian',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '200px'
      },
      {
        id: 'work_status',
        title: 'Status Kerja',
        type: DynamicTableModel.IColumnType.TEXT,
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
        id: 'departement',
        title: 'Departement',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: ''
      },
      {
        id: 'employment_status',
        title: 'Status Kepegawaian',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: ''
      },
      {
        id: 'work_status',
        title: 'Status Kerja',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: ''
      },
    ],
    sort: [
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        value: ''
      },
      {
        id: 'departement',
        title: 'Departement',
        value: ''
      },
      {
        id: 'employment_status',
        title: 'Status Kepegawaian',
        value: ''
      },
      {
        id: 'work_status',
        title: 'Status Kerja',
        value: ''
      },
    ],
    paging: true,
  };

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initChart();
  }

  private initChart() {
    const getColorFromClass = (className: string) => {
      const el = document.createElement('div');
      el.className = className;
      document.body.appendChild(el);
      const color = getComputedStyle(el).backgroundColor;
      document.body.removeChild(el);
      return color;
    };

    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--p-text-color');
    const textColorSecondary = getComputedStyle(document.documentElement).getPropertyValue('--p-text-muted-color');
    const surfaceBorder = getComputedStyle(document.documentElement).getPropertyValue('--p-content-border-color');

    this.WorkHoursChart.datasource = {
      labels: ['10 Oct', '11 Oct', '12 Oct', '13 Oct', '14 Oct', '15 Oct', '16 Oct', '17 Oct'],
      datasets: [
        {
          type: 'bar',
          label: 'Jam Kerja',
          backgroundColor: getColorFromClass('bg-sky-600'),
          data: [36, 36, 0, 36, 36, 24, 34, 36]
        },
        {
          type: 'bar',
          label: 'Overtime',
          backgroundColor: getColorFromClass('bg-fuchsia-200'),
          data: [2, 3, 8, 0, 4, 8, 1, 3]
        },
      ]
    };

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

    this.cd.markForCheck();
  }

  handleFakeEmployee() {

  }
}
