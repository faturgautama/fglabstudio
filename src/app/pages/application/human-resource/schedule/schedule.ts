import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  isWeekend,
  addMonths,
  subMonths,
  differenceInDays
} from 'date-fns';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';

// Models & Services
import { EmployeeAction, EmployeeState } from '../../../../store/human-resource/employee';
import { LeaveAction, LeaveState } from '../../../../store/human-resource/leave';
import { DepartementAction, DepartementState } from '../../../../store/human-resource/departement';
import { CompanySettingState } from '../../../../store/human-resource/company-setting';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface DayInfo {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  dayName: string;
  dayNumber: number;
  month: string;
  year: number;
}

interface TimeOffPosition {
  entry: EmployeeModel.ILeave;
  left: number;
  width: number;
  rowIndex: number;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    ToastModule,
    TabsModule,
    DshBaseLayout,
    TooltipModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // Forms
  createLeaveForm!: FormGroup;
  assignLeaveForm!: FormGroup;

  // Signals
  currentDate = signal(new Date());
  searchQuery = signal('');
  selectedDepartmentId = signal<string>('all');
  showCreateDialog = signal(false);
  showAssignDialog = signal(false);

  // Data signals
  employees = signal<any[]>([]);
  timeOffEntries = signal<EmployeeModel.ILeave[]>([]);
  departments = signal<EmployeeModel.IDepartment[]>([]);
  leavePolicies = signal<EmployeeModel.ILeavePolicy[]>([]);

  // Dropdown options
  employeeOptions = computed(() => {
    return this.employees().map(emp => ({
      label: emp.full_name,
      value: emp.id
    }));
  });

  leavePolicyOptions = computed(() => {
    return this.leavePolicies().map(policy => ({
      label: policy.title,
      value: policy.id || policy.code
    }));
  });

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  // Computed signals
  visibleDays = computed(() => {
    const current = this.currentDate();
    const start = startOfMonth(current);
    const end = endOfMonth(addMonths(current, 1)); // Show 2 months

    return eachDayOfInterval({ start, end }).map(date => ({
      date,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      dayName: format(date, 'EEE'),
      dayNumber: parseInt(format(date, 'd')),
      month: format(date, 'MMMM'),
      year: parseInt(format(date, 'yyyy'))
    }));
  });

  filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const deptId = this.selectedDepartmentId();

    return this.employees().filter(emp => {
      // Filter by search query
      const matchQuery = !query ||
        emp.full_name?.toLowerCase().includes(query) ||
        emp.position?.title?.toLowerCase().includes(query) ||
        emp.employee_code?.toLowerCase().includes(query);

      // Filter by department
      const matchDept = deptId === 'all' || emp.department_id === deptId;

      return matchQuery && matchDept;
    });
  });

  // Timeline positioning
  timeOffPositions = computed(() => {
    const entries = this.timeOffEntries();
    const days = this.visibleDays();
    const employees = this.filteredEmployees();

    if (days.length === 0) return [];

    const startDate = days[0].date;
    const endDate = days[days.length - 1].date;
    const totalDays = days.length;

    return entries
      .filter(entry => !entry.is_delete && entry.status === 'approved')
      .filter(entry => {
        const entryStart = new Date(entry.start_date);
        const entryEnd = new Date(entry.end_date);
        return entryStart <= endDate && entryEnd >= startDate;
      })
      .map(entry => {

        console.log("Processing entry:", entry);

        const rowIndex = employees.findIndex(emp => emp.id?.toString() === entry.employee_id?.toString());

        if (rowIndex === -1) return null;

        const entryStart = new Date(entry.start_date);
        const entryEnd = new Date(entry.end_date);

        const visibleStart = entryStart < startDate ? startDate : entryStart;
        const visibleEnd = entryEnd > endDate ? endDate : entryEnd;

        const daysFromStart = differenceInDays(visibleStart, startDate);
        const entryDuration = differenceInDays(visibleEnd, visibleStart) + 1;

        const left = (daysFromStart / totalDays) * 100;
        const width = (entryDuration / totalDays) * 100;

        return {
          entry,
          left,
          width,
          rowIndex
        };
      })
      .filter((pos) => pos !== null);
  });

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    // Load data from store
    this.store
      .select(EmployeeState.getAll)
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => {
        this.employees.set(employees);
      });

    this.store
      .select(LeaveState.getAll)
      .pipe(takeUntil(this.destroy$))
      .subscribe(entries => {
        this.timeOffEntries.set(entries);
      });

    this.store
      .select(DepartementState.getAll)
      .pipe(takeUntil(this.destroy$))
      .subscribe(departments => {
        const allDept = { id: 'all', title: 'All Departments', is_active: true, code: 'ALL', created_at: new Date() };
        this.departments.set([allDept, ...departments.filter(d => d.is_active)]);
      });

    this.store
      .select(CompanySettingState.getLeavePolicies)
      .pipe(takeUntil(this.destroy$))
      .subscribe(policies => {
        if (policies) {
          this.leavePolicies.set(policies.filter(p => p.is_active));
        }
      });

    // Dispatch initial load
    this.store.dispatch(new EmployeeAction.GetEmployee());
    this.store.dispatch(new LeaveAction.GetLeave());
    this.store.dispatch(new DepartementAction.GetDepartement());

    console.log("time off =>", this.timeOffPositions())
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForms(): void {
    this.createLeaveForm = this.fb.group({
      leave_policy_id: ['', Validators.required],
      start_date: [new Date(), Validators.required],
      end_date: [new Date(), Validators.required],
      reason: [''],
      status: ['pending']
    });

    this.assignLeaveForm = this.fb.group({
      employee_id: ['', Validators.required],
      leave_policy_id: ['', Validators.required],
      start_date: [new Date(), Validators.required],
      end_date: [new Date(), Validators.required],
      reason: [''],
      status: ['approved']
    });
  }

  // Navigation methods
  previousMonth(): void {
    this.currentDate.set(subMonths(this.currentDate(), 1));
  }

  nextMonth(): void {
    this.currentDate.set(addMonths(this.currentDate(), 1));
  }

  goToToday(): void {
    this.currentDate.set(new Date());
  }

  // Filter methods
  onDepartmentChange(deptId: string): void {
    this.selectedDepartmentId.set(deptId);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  // Helper methods
  getLeaveTypeColor(policyId: string): string {
    const policy = this.leavePolicies().find(p => p.id === policyId || p.code === policyId);
    if (!policy) return '#6B7280';

    const colors: Record<string, string> = {
      'annual': '#3B82F6',
      'maternity': '#EC4899',
      'paternity': '#8B5CF6',
      'sick': '#EF4444',
      'unpaid': '#F59E0B',
      'other': '#10B981'
    };
    return colors[policy.leave_type] || '#6B7280';
  }

  getLeaveTypeName(policyId: string): string {
    const policy = this.leavePolicies().find(p => p.id === policyId || p.code === policyId);
    return policy?.title || 'Time-off';
  }

  getLeaveTypeClass(policyId: string): string {
    const policy = this.leavePolicies().find(p => p.id === policyId || p.code === policyId);
    if (!policy) return 'other';
    return policy.leave_type;
  }
}