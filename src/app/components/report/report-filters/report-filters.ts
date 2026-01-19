import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
    ReportConfig,
    ReportFilter,
    FilterType,
    PeriodType,
    IReportDataProvider,
    FilterOption
} from '../../../model/shared/report.model';

@Component({
    selector: 'app-report-filters',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SelectModule,
        DatePickerModule,
        InputTextModule,
        ButtonModule
    ],
    templateUrl: './report-filters.html',
    styleUrls: ['./report-filters.scss']
})
export class ReportFiltersComponent implements OnInit, OnChanges {
    @Input() reportConfig?: ReportConfig;
    @Input() dataProvider?: IReportDataProvider;
    @Output() filtersChanged = new EventEmitter<ReportFilter>();
    @Output() generateClicked = new EventEmitter<ReportFilter>();

    filterForm!: FormGroup;
    FilterType = FilterType;
    PeriodType = PeriodType;

    periodTypes = [
        { label: 'Date Range', value: PeriodType.DATE_RANGE },
        { label: 'Month', value: PeriodType.MONTH },
        { label: 'Year', value: PeriodType.YEAR }
    ];

    months = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
    ];

    years: { label: string; value: number }[] = [];
    departments: FilterOption[] = [];
    employees: FilterOption[] = [];
    positions: FilterOption[] = [];
    statuses: FilterOption[] = [];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initializeYears();
        this.initializeFilters();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['reportConfig'] && !changes['reportConfig'].firstChange) {
            this.initializeFilters();
        }
    }

    initializeYears(): void {
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 10; i--) {
            this.years.push({ label: i.toString(), value: i });
        }
    }

    initializeFilters(): void {
        if (!this.reportConfig) return;

        const formConfig: any = {
            periodType: [PeriodType.DATE_RANGE]
        };

        if (this.hasFilter(FilterType.PERIOD)) {
            formConfig.startDate = [null, Validators.required];
            formConfig.endDate = [null, Validators.required];
            formConfig.month = [null];
            formConfig.year = [null];
        }

        if (this.hasFilter(FilterType.DEPARTMENT)) {
            formConfig.department = [null];
            this.loadFilterOptions(FilterType.DEPARTMENT);
        }

        if (this.hasFilter(FilterType.EMPLOYEE)) {
            formConfig.employee = [null];
            this.loadFilterOptions(FilterType.EMPLOYEE);
        }

        if (this.hasFilter(FilterType.POSITION)) {
            formConfig.position = [null];
            this.loadFilterOptions(FilterType.POSITION);
        }

        if (this.hasFilter(FilterType.STATUS)) {
            formConfig.status = [null];
            this.loadFilterOptions(FilterType.STATUS);
        }

        this.filterForm = this.fb.group(formConfig);

        this.filterForm.get('periodType')?.valueChanges.subscribe(value => {
            this.updatePeriodValidators(value);
        });
    }

    updatePeriodValidators(periodType: PeriodType): void {
        const startDateControl = this.filterForm.get('startDate');
        const endDateControl = this.filterForm.get('endDate');
        const monthControl = this.filterForm.get('month');
        const yearControl = this.filterForm.get('year');

        if (periodType === PeriodType.DATE_RANGE) {
            startDateControl?.setValidators([Validators.required]);
            endDateControl?.setValidators([Validators.required]);
            monthControl?.clearValidators();
            yearControl?.clearValidators();
        } else if (periodType === PeriodType.MONTH) {
            startDateControl?.clearValidators();
            endDateControl?.clearValidators();
            monthControl?.setValidators([Validators.required]);
            yearControl?.setValidators([Validators.required]);
        } else if (periodType === PeriodType.YEAR) {
            startDateControl?.clearValidators();
            endDateControl?.clearValidators();
            monthControl?.clearValidators();
            yearControl?.setValidators([Validators.required]);
        }

        startDateControl?.updateValueAndValidity();
        endDateControl?.updateValueAndValidity();
        monthControl?.updateValueAndValidity();
        yearControl?.updateValueAndValidity();
    }

    loadFilterOptions(filterType: FilterType): void {
        if (!this.dataProvider) return;

        this.dataProvider.getFilterOptions(filterType).subscribe(options => {
            switch (filterType) {
                case FilterType.DEPARTMENT:
                    this.departments = options;
                    break;
                case FilterType.EMPLOYEE:
                    this.employees = options;
                    break;
                case FilterType.POSITION:
                    this.positions = options;
                    break;
                case FilterType.STATUS:
                    this.statuses = options;
                    break;
            }
        });
    }

    hasFilter(filterType: FilterType): boolean {
        return this.reportConfig?.availableFilters.includes(filterType) || false;
    }

    validateFilters(): boolean {
        if (!this.filterForm.valid) {
            Object.keys(this.filterForm.controls).forEach(key => {
                this.filterForm.get(key)?.markAsTouched();
            });
            return false;
        }

        const periodType = this.filterForm.get('periodType')?.value;
        const startDate = this.filterForm.get('startDate')?.value;
        const endDate = this.filterForm.get('endDate')?.value;

        if (periodType === PeriodType.DATE_RANGE && startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                alert('Start date must be before end date');
                return false;
            }
        }

        return true;
    }

    applyFilters(): void {
        if (!this.validateFilters() || !this.reportConfig) return;

        const formValue = this.filterForm.value;
        const filters: ReportFilter = {
            reportType: this.reportConfig.type,
            periodType: formValue.periodType
        };

        if (formValue.periodType === PeriodType.DATE_RANGE) {
            filters.startDate = formValue.startDate;
            filters.endDate = formValue.endDate;
        } else if (formValue.periodType === PeriodType.MONTH) {
            filters.month = formValue.month;
            filters.year = formValue.year;
        } else if (formValue.periodType === PeriodType.YEAR) {
            filters.year = formValue.year;
        }

        const additionalFilters = new Map<string, any>();
        if (formValue.department) additionalFilters.set('department', formValue.department);
        if (formValue.employee) additionalFilters.set('employee', formValue.employee);
        if (formValue.position) additionalFilters.set('position', formValue.position);
        if (formValue.status) additionalFilters.set('status', formValue.status);

        if (additionalFilters.size > 0) {
            filters.filters = additionalFilters;
        }

        this.generateClicked.emit(filters);
    }

    resetFilters(): void {
        this.filterForm.reset({
            periodType: PeriodType.DATE_RANGE
        });
    }
}
