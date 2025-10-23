import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Subject, takeUntil } from 'rxjs';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { ShiftService } from '../../../../services/pages/application/human-resource/shift.service';
import { ShiftState, ShiftAction } from '../../../../store/human-resource/shift';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-shift',
  imports: [
    FormsModule,
    ButtonModule,
    DynamicTable,
    DialogModule,
    SelectModule,
    DshBaseLayout,
    TextareaModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './shift.html',
  styleUrl: './shift.scss'
})
export class Shift implements OnInit, OnDestroy {

  _store = inject(Store);
  _shiftService = inject(ShiftService);
  _messageService = inject(MessageService);
  _confirmationService = inject(ConfirmationService);

  Destroy$ = new Subject();

  TableProps: DynamicTableModel.ITable = {
    id: 'shift',
    title: 'Daftar Shift Karyawan',
    description: 'Daftar shift aktif perusahaan',
    column: [
      {
        id: 'code',
        title: 'Kode Shift',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '250px'
      },
      {
        id: 'title',
        title: 'Nama Shift',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '400px'
      },
      {
        id: 'start_time',
        title: 'Waktu Mulai',
        type: DynamicTableModel.IColumnType.TIME,
        width: '250px'
      },
      {
        id: 'end_time',
        title: 'Waktu Selesai',
        type: DynamicTableModel.IColumnType.TIME,
        width: '250px'
      },
      {
        id: 'break_duration',
        title: 'Durasi Istirahat',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '250px'
      },
      {
        id: 'created_at',
        title: 'Waktu Entry',
        type: DynamicTableModel.IColumnType.DATETIME,
        width: '300px'
      },
    ],
    datasource: [],
    filter: [
      {
        id: 'code',
        title: 'Kode Shift',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'title',
        title: 'Nama Shift',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
    ],
    sort: [
      {
        id: 'code',
        title: 'Kode Shift',
        value: ''
      },
      {
        id: 'title',
        title: 'Nama Shift',
        value: ''
      },
    ],
    toolbar: [
      { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
      { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
    ],
    paging: true,
    custom_button: [
      { id: 'add', title: 'Add', icon: 'pi pi-plus' }
    ]
  };

  _modalToggler = false;

  _formBuilder = inject(FormBuilder);
  _formState: 'insert' | 'update' = 'insert';
  Form = this._formBuilder.group({
    id: ['', []],
    code: ['', [Validators.required]],
    title: ['', [Validators.required]],
    start_time: ['', [Validators.required]],
    end_time: ['', [Validators.required]],
    break_duration: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this._store
      .select(ShiftState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.TableProps.datasource = result.map((item: any) => { return { ...item, break_duration: `${item.break_duration} Menit` } }));
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
    if (args.id == 'add') {
      this._formState = 'insert';
      this.Form.reset();
      this._modalToggler = true;
    }
  }

  handleToolbarClicked(args: any) {
    if (args.toolbar.id == 'detail') {
      this._formState = 'update';
      this._modalToggler = true;
      this.Form.patchValue({
        ...args.data,
      });
    };

    if (args.toolbar.id == 'delete') {
      this._confirmationService.confirm({
        message: 'Apakah anda yakin menghapus data ini?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Hapus',
          severity: 'danger',
        },
        accept: () => {
          this._store
            .dispatch(new ShiftAction.DeleteShift(args.data.id))
            .subscribe((result) => {
              setTimeout(() => {
                this._messageService.clear();
                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Shift Berhasil Dihapus' });
              }, 3100);
            })
        },
      });
    };
  }

  handleSave(args: any) {
    if (this.Form.valid) {
      this._store
        .dispatch(new ShiftAction.AddShift(args))
        .subscribe((result) => {
          setTimeout(() => {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Shift Berhasil Disimpan' });
            this.resetForm(true);
          }, 3100);
        })
    }
  }

  handleUpdate(args: any) {
    if (this.Form.valid) {
      this._store
        .dispatch(new ShiftAction.UpdateShift(args))
        .subscribe((result) => {
          setTimeout(() => {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Shift Berhasil Diubah' });
            this.resetForm(true);
          }, 3100);
        })
    }
  }

  private resetForm(closeModal?: boolean) {
    this.Form.reset();
    this._formBuilder.group({
      id: ['', []],
      code: ['', [Validators.required]],
      title: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      break_duration: [0, [Validators.required]],
    });
    this._formState = 'insert';
    if (closeModal) {
      this._modalToggler = false;
    }
  }
}
