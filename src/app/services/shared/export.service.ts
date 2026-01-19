import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportData, ReportConfig, ExportFormat, ReportColumn } from '../../model/shared/report.model';

@Injectable({ providedIn: 'root' })
export class ExportService {

    exportReport(data: ReportData, config: ReportConfig, format: ExportFormat): Observable<void> {
        if (format === ExportFormat.EXCEL) {
            return this.exportToExcel(data, config);
        } else {
            return this.exportToPDF(data, config);
        }
    }

    exportToExcel(data: ReportData, config: ReportConfig): Observable<void> {
        return from(this.generateExcelFile(data, config)).pipe(
            map(() => void 0)
        );
    }

    exportToPDF(data: ReportData, config: ReportConfig): Observable<void> {
        return from(this.generatePDFFile(data, config)).pipe(
            map(() => void 0)
        );
    }

    generateFilename(reportType: string, format: ExportFormat): string {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        return `${reportType}_report_${dateStr}.${format}`;
    }

    private async generateExcelFile(data: ReportData, config: ReportConfig): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(config.title);

        // Add title
        worksheet.mergeCells('A1:' + this.getColumnLetter(config.columns.length) + '1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = config.title;
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getRow(1).height = 30;

        // Add metadata
        let currentRow = 3;
        worksheet.getCell(`A${currentRow}`).value = 'Generated At:';
        worksheet.getCell(`B${currentRow}`).value = data.metadata.generatedAt.toLocaleString('id-ID');
        currentRow++;

        worksheet.getCell(`A${currentRow}`).value = 'Total Records:';
        worksheet.getCell(`B${currentRow}`).value = data.metadata.totalRows;
        currentRow++;

        // Add filter information
        if (data.metadata.filters.startDate && data.metadata.filters.endDate) {
            worksheet.getCell(`A${currentRow}`).value = 'Period:';
            worksheet.getCell(`B${currentRow}`).value =
                `${data.metadata.filters.startDate.toLocaleDateString('id-ID')} - ${data.metadata.filters.endDate.toLocaleDateString('id-ID')}`;
            currentRow++;
        }

        currentRow++;

        // Add summary section if available
        if (data.summary) {
            worksheet.getCell(`A${currentRow}`).value = 'Summary';
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
            currentRow++;

            Object.entries(data.summary).forEach(([key, value]) => {
                worksheet.getCell(`A${currentRow}`).value = this.formatKey(key) + ':';
                worksheet.getCell(`B${currentRow}`).value = value;
                currentRow++;
            });

            currentRow++;
        }

        // Add data table header
        const headerRow = worksheet.getRow(currentRow);
        config.columns.forEach((col, index) => {
            const cell = headerRow.getCell(index + 1);
            cell.value = col.header;
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        currentRow++;

        // Add data rows
        data.rows.forEach(row => {
            const dataRow = worksheet.getRow(currentRow);
            config.columns.forEach((col, index) => {
                const cell = dataRow.getCell(index + 1);
                const value = row[col.field];

                if (col.type === 'currency' || col.type === 'number') {
                    cell.value = typeof value === 'number' ? value : 0;
                    if (col.type === 'currency') {
                        cell.numFmt = '#,##0';
                    } else {
                        cell.numFmt = '#,##0.00';
                    }
                } else if (col.type === 'date') {
                    cell.value = value instanceof Date ? value : new Date(value);
                    cell.numFmt = 'dd/mm/yyyy';
                } else if (col.type === 'percentage') {
                    cell.value = typeof value === 'number' ? value / 100 : 0;
                    cell.numFmt = '0.00%';
                } else {
                    cell.value = value !== null && value !== undefined ? String(value) : '-';
                }

                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            currentRow++;
        });

        // Auto-fit columns
        config.columns.forEach((col, index) => {
            const column = worksheet.getColumn(index + 1);
            column.width = col.width ? parseInt(col.width) / 8 : 15;
        });

        // Generate and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.generateFilename(data.metadata.reportType, ExportFormat.EXCEL);
        link.click();
        window.URL.revokeObjectURL(url);
    }

    private async generatePDFFile(data: ReportData, config: ReportConfig): Promise<void> {
        const doc = new jsPDF({
            orientation: config.columns.length > 5 ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(config.title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

        // Add metadata
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        let yPos = 25;
        doc.text(`Generated: ${data.metadata.generatedAt.toLocaleString('id-ID')}`, 14, yPos);
        yPos += 5;
        doc.text(`Total Records: ${data.metadata.totalRows}`, 14, yPos);
        yPos += 5;

        if (data.metadata.filters.startDate && data.metadata.filters.endDate) {
            doc.text(
                `Period: ${data.metadata.filters.startDate.toLocaleDateString('id-ID')} - ${data.metadata.filters.endDate.toLocaleDateString('id-ID')}`,
                14,
                yPos
            );
            yPos += 5;
        }

        yPos += 5;

        // Add summary section if available
        if (data.summary) {
            doc.setFont('helvetica', 'bold');
            doc.text('Summary', 14, yPos);
            yPos += 5;
            doc.setFont('helvetica', 'normal');

            Object.entries(data.summary).forEach(([key, value]) => {
                doc.text(`${this.formatKey(key)}: ${value}`, 14, yPos);
                yPos += 5;
            });

            yPos += 5;
        }

        // Prepare table data
        const headers = config.columns.map(col => col.header);
        const rows = data.rows.map(row => {
            return config.columns.map(col => {
                const value = row[col.field];
                return this.formatCellValueForPDF(value, col);
            });
        });

        // Add table using autoTable
        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: yPos,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [224, 224, 224],
                textColor: [0, 0, 0],
                fontStyle: 'bold'
            },
            columnStyles: this.getColumnStyles(config),
            didDrawPage: (data) => {
                const pageCount = (doc as any).internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.text(
                    `Page ${data.pageNumber} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }
        });

        // Download
        doc.save(this.generateFilename(data.metadata.reportType, ExportFormat.PDF));
    }

    private formatCellValueForPDF(value: any, column: ReportColumn): string {
        if (value === null || value === undefined) {
            return '-';
        }

        switch (column.type) {
            case 'currency':
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(value);
            case 'percentage':
                return `${value.toFixed(2)}%`;
            case 'date':
                const date = value instanceof Date ? value : new Date(value);
                return date.toLocaleDateString('id-ID');
            case 'number':
                return value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            case 'boolean':
                return value ? 'Yes' : 'No';
            default:
                return String(value);
        }
    }

    private getColumnStyles(config: ReportConfig): any {
        const styles: any = {};
        config.columns.forEach((col, index) => {
            if (col.type === 'currency' || col.type === 'number') {
                styles[index] = { halign: 'right' };
            } else if (col.type === 'date') {
                styles[index] = { halign: 'center' };
            }
        });
        return styles;
    }

    private formatKey(key: string): string {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    private getColumnLetter(columnNumber: number): string {
        let letter = '';
        while (columnNumber > 0) {
            const remainder = (columnNumber - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            columnNumber = Math.floor((columnNumber - 1) / 26);
        }
        return letter;
    }
}
