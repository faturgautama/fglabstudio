import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  subMonths
} from 'date-fns';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';

// Models & Services
import { EmployeeAction, EmployeeState } from '../../../../store/human-resource/employee';
import { LeaveAction, LeaveState } from '../../../../store/human-resource/leave';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";

@Component({
  selector: 'app-time-off',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TabsModule,
    DialogModule,
    AvatarModule,
    DshBaseLayout
  ],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // Signals
  currentDate = signal(new Date());
  searchQuery = signal('');
  selectedDepartment = signal('all');
  showCreateDialog = signal(false);
  showAssignDialog = signal(false);

  // Data signals
  employees = signal<any[]>([]);
  timeOffEntries = signal<EmployeeModel.ILeave[]>([]);
  departments = signal<EmployeeModel.IDepartment[]>([]);

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
    const dept = this.selectedDepartment();

    return this.employees().filter(emp => {
      const matchQuery = !query ||
        emp.full_name.toLowerCase().includes(query) ||
        emp.position.title.toLowerCase().includes(query);

      const matchDept = dept === 'all' || emp.department.title === dept;

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
      .filter(entry => {
        // Filter entries that overlap with visible date range
        return entry.start_date <= endDate && entry.end_date >= startDate;
      })
      .map(entry => {
        console.log("Processing entry:", entry);

        // Find employee row index
        const rowIndex = employees.findIndex(emp => emp.id === entry.employee_id);

        if (rowIndex === -1) return null;

        // Calculate position
        const entryStart = entry.start_date < startDate ? startDate : entry.start_date;
        const entryEnd = entry.end_date > endDate ? endDate : entry.end_date;

        const daysFromStart = Math.floor((entryStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const entryDuration = Math.floor((entryEnd.getTime() - entryStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const left = (daysFromStart / totalDays) * 100;
        const width = (entryDuration / totalDays) * 100;

        return {
          entry,
          left,
          width,
          rowIndex
        } as any;
      })
      .filter(pos => pos !== null) as any[];
  });

  constructor(private store: Store) { }

  ngOnInit(): void {
    // Load data from store
    this.store
      .select(EmployeeState.getAll)
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => this.employees.set(employees));

    console.log("Employees:", this.employees());

    this.store
      .select(LeaveState.getAll)
      .pipe(takeUntil(this.destroy$))
      .subscribe(entries => this.timeOffEntries.set(entries));

    // Dispatch initial load
    this.store.dispatch(new EmployeeAction.GetEmployee());
    this.store.dispatch(new LeaveAction.GetLeave());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Navigation methods
  previousMonth() {
    this.currentDate.set(subMonths(this.currentDate(), 1));
  }

  nextMonth() {
    this.currentDate.set(addMonths(this.currentDate(), 1));
  }

  goToToday() {
    this.currentDate.set(new Date());
  }

  // Filter methods
  onDepartmentChange(deptId: string) {
    this.selectedDepartment.set(deptId);
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  // Dialog methods
  openCreateDialog() {
    this.showCreateDialog.set(true);
  }

  openAssignDialog() {
    this.showAssignDialog.set(true);
  }

  closeDialogs() {
    this.showCreateDialog.set(false);
    this.showAssignDialog.set(false);
  }

  // Create time-off
  onCreateTimeOff(data: any) {
    console.log('Creating time-off:', data);
  }

  // Helper methods
  getLeaveTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'time-off': '#3B82F6',      // Blue
      'holiday': '#10B981',       // Green
      'sick': '#EF4444',          // Red
      'vacation': '#8B5CF6'       // Purple
    };
    return colors[type] || '#6B7280';
  }

  getLeaveTypeName(type: string): string {
    const names: Record<string, string> = {
      'time-off': 'Time-off',
      'holiday': 'Holiday',
      'sick': 'Sick',
      'vacation': 'Vacation'
    };
    return names[type] || type;
  }
}