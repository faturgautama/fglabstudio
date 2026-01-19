import { Type } from '@angular/core';
import { Observable } from 'rxjs';

// Report Type Enumeration (can be extended per product)
export enum ReportType {
    ATTENDANCE = 'attendance',
    PAYROLL = 'payroll',
    LEAVE = 'leave',
    OVERTIME = 'overtime',
    EMPLOYEE = 'employee'
}

// Export Format Enumeration
export enum ExportFormat {
    EXCEL = 'excel',
    PDF = 'pdf'
}

// Period Type for Filtering
export enum PeriodType {
    DATE_RANGE = 'dateRange',
    MONTH = 'month',
    YEAR = 'year'
}

// Filter Type Enumeration
export enum FilterType {
    PERIOD = 'period',
    DEPARTMENT = 'department',
    EMPLOYEE = 'employee',
    POSITION = 'position',
    STATUS = 'status',
    CUSTOM = 'custom'
}

// Generic Report Filter Interface
export interface ReportFilter {
    reportType: string;
    periodType?: PeriodType;
    startDate?: Date;
    endDate?: Date;
    month?: number;
    year?: number;
    filters?: Map<string, any>;
}

// Report Configuration (defines how a report behaves)
export interface ReportConfig {
    type: string;
    title: string;
    description: string;
    availableFilters: FilterType[];
    columns: ReportColumn[];
    dataProvider: Type<IReportDataProvider>;
    customFilters?: CustomFilterConfig[];
}

// Report Column Definition
export interface ReportColumn {
    field: string;
    header: string;
    type: 'text' | 'number' | 'currency' | 'date' | 'percentage' | 'boolean';
    sortable: boolean;
    width?: string;
    formatter?: (value: any) => string;
}

// Custom Filter Configuration
export interface CustomFilterConfig {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'date';
    options?: { label: string; value: any }[];
    required?: boolean;
}

// Report Data Structure (generic)
export interface ReportData {
    metadata: ReportMetadata;
    summary?: ReportSummary;
    rows: ReportRow[];
}

// Report Metadata
export interface ReportMetadata {
    reportType: string;
    title: string;
    generatedAt: Date;
    filters: ReportFilter;
    totalRows: number;
}

// Report Summary (for aggregate statistics)
export interface ReportSummary {
    [key: string]: number | string;
}

// Report Row (flexible structure)
export interface ReportRow {
    [key: string]: any;
}

// Filter Option for dropdowns
export interface FilterOption {
    label: string;
    value: any;
    disabled?: boolean;
}

// Validation Result
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
}

// DATA PROVIDER INTERFACE (Contract Layer)
export interface IReportDataProvider {
    fetchData(filters: ReportFilter): Observable<ReportRow[]>;
    calculateSummary(rows: ReportRow[]): ReportSummary;
    validateFilters(filters: ReportFilter): ValidationResult;
    getFilterOptions(filterType: FilterType): Observable<FilterOption[]>;
}
