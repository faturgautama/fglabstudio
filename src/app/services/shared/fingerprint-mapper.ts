/**
 * Fingerprint Column Mapper Utility
 * Generalizes and maps fingerprint device CSV columns to attendance model
 */

export interface FingerprintColumnMapping {
    employee_id?: string;
    employee_code?: string;
    check_in?: string;
    check_out?: string;
    date?: string;
    name?: string;
    [key: string]: string | undefined;
}

export interface FingerprintMapperConfig {
    hasHeader: boolean;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    columnMapping: FingerprintColumnMapping;
}

/**
 * Common fingerprint device CSV column patterns
 */
const COMMON_COLUMN_PATTERNS = {
    employee_id: ['emp id', 'employee id', 'id', 'emp_id', 'employee_id', 'no. emp', 'nip', 'empid'],
    employee_code: ['emp code', 'employee code', 'code', 'emp_code', 'employee_code', 'kode', 'no. karyawan', 'empcode', 'no emp'],
    name: ['name', 'nama', 'employee name', 'employee_name', 'nama karyawan', 'fullname', 'full_name'],
    check_in: ['checkin', 'check in', 'check_in', 'in time', 'in_time', 'jam masuk', 'masuk', 'intime', 'punch in', 'punch_in'],
    check_out: ['checkout', 'check out', 'check_out', 'out time', 'out_time', 'jam keluar', 'keluar', 'outtime', 'punch out', 'punch_out'],
    date: ['date', 'tanggal', 'tgl', 'record date', 'record_date', 'punch date', 'punch_date', 'workdate', 'work_date', 'attendance date'],
};

/**
 * Auto-detect column mapping from CSV headers
 * @param headers - Array of CSV column headers
 * @returns Detected column mapping
 */
export function autoDetectColumnMapping(headers: string[]): FingerprintColumnMapping {
    const mapping: FingerprintColumnMapping = {};

    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

    // Try to match each pattern
    for (const [key, patterns] of Object.entries(COMMON_COLUMN_PATTERNS)) {
        for (let i = 0; i < normalizedHeaders.length; i++) {
            const header = normalizedHeaders[i];
            // Check for exact match or contains pattern
            const isMatch = patterns.some(pattern =>
                header === pattern || header.includes(pattern) || pattern.includes(header)
            );

            if (isMatch) {
                mapping[key] = headers[i]; // Use original case
                break;
            }
        }
    }

    return mapping;
}

/**
 * Parse fingerprint CSV row using column mapping
 * @param row - Single CSV row as array
 * @param mapping - Column mapping configuration
 * @param headers - Original CSV headers
 * @param dateFormat - Date format in CSV
 * @returns Parsed attendance data
 */
export function parseFingerprintRow(
    row: string[],
    mapping: FingerprintColumnMapping,
    headers: string[],
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' = 'DD/MM/YYYY'
): any {
    const result: any = {
        employee_code: '',
        employee_id: '',
        check_in: undefined,
        check_out: undefined,
        date: new Date().toISOString().split('T')[0],
        is_present: false,
        work_hours: 0,
        overtime_hours: 0,
        is_late: false,
    };

    // Create a map of header -> column index
    const headerIndexMap: { [key: string]: number } = {};
    headers.forEach((header, index) => {
        headerIndexMap[header] = index;
    });

    // Map employee_code
    if (mapping.employee_code) {
        const index = headerIndexMap[mapping.employee_code];
        if (index !== undefined && row[index]) {
            result.employee_code = row[index].trim();
        }
    }

    // Map employee_id
    if (mapping.employee_id) {
        const index = headerIndexMap[mapping.employee_id];
        if (index !== undefined && row[index]) {
            const val = row[index].trim();
            result.employee_id = isNaN(Number(val)) ? val : Number(val);
        }
    }

    // Map date
    if (mapping.date) {
        const index = headerIndexMap[mapping.date];
        if (index !== undefined && row[index]) {
            result.date = formatDate(row[index].trim(), dateFormat);
        }
    }

    // Map check_in
    if (mapping.check_in) {
        const index = headerIndexMap[mapping.check_in];
        if (index !== undefined && row[index]) {
            const timeStr = row[index].trim();
            if (timeStr && timeStr !== '-' && timeStr.toLowerCase() !== 'null' && timeStr !== '') {
                result.check_in = formatTime(timeStr);
                result.is_present = true;
            }
        }
    }

    // Map check_out
    if (mapping.check_out) {
        const index = headerIndexMap[mapping.check_out];
        if (index !== undefined && row[index]) {
            const timeStr = row[index].trim();
            if (timeStr && timeStr !== '-' && timeStr.toLowerCase() !== 'null' && timeStr !== '') {
                result.check_out = formatTime(timeStr);
            }
        }
    }

    return result;
}

/**
 * Format time from various formats to HH:MM or HH:MM:SS
 */
function formatTime(timeStr: string): string {
    try {
        // Remove spaces
        timeStr = timeStr.trim();

        // Handle HH:MM:SS, HH:MM, HH.MM.SS, HH.MM
        const parts = timeStr.replace(/\./g, ':').split(':').map(p => p.trim());

        if (parts.length < 2) {
            return '00:00:00';
        }

        const hour = String(parseInt(parts[0]) || 0).padStart(2, '0');
        const minute = String(parseInt(parts[1]) || 0).padStart(2, '0');
        const second = parts.length > 2 ? String(parseInt(parts[2]) || 0).padStart(2, '0') : '00';

        return `${hour}:${minute}:${second}`;
    } catch {
        return '00:00:00';
    }
}

/**
 * Format date from various formats to YYYY-MM-DD
 */
function formatDate(dateStr: string, format: string): string {
    try {
        dateStr = dateStr.trim();

        // Try to split by common separators
        const parts = dateStr.split(/[-/.]/).map(p => p.trim());

        if (parts.length < 3) {
            return new Date().toISOString().split('T')[0];
        }

        let year: number, month: number, day: number;

        if (format === 'DD/MM/YYYY') {
            [day, month, year] = parts.map(Number);
        } else if (format === 'MM/DD/YYYY') {
            [month, day, year] = parts.map(Number);
        } else { // YYYY-MM-DD
            [year, month, day] = parts.map(Number);
        }

        // Validate
        if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
            return new Date().toISOString().split('T')[0];
        }

        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

/**
 * Calculate check-in violations and work hours
 */
export function calculateAttendanceMetrics(
    checkInTime: string | undefined,
    checkOutTime: string | undefined,
    shiftStartTime: string,
    shiftEndTime: string,
    breakDuration: number = 0
): {
    is_late: boolean;
    work_hours: number;
    overtime_hours: number;
} {
    if (!checkInTime || !checkOutTime) {
        return { is_late: false, work_hours: 0, overtime_hours: 0 };
    }

    try {
        const checkIn = timeToMinutes(checkInTime);
        const checkOut = timeToMinutes(checkOutTime);
        const shiftStart = timeToMinutes(shiftStartTime);
        const shiftEnd = timeToMinutes(shiftEndTime);

        const is_late = checkIn > shiftStart;
        const actualWorkMinutes = Math.max(0, checkOut - checkIn - breakDuration);
        const expectedWorkMinutes = shiftEnd - shiftStart - breakDuration;

        const work_hours = parseFloat((actualWorkMinutes / 60).toFixed(2));
        const overtime_hours = parseFloat(Math.max(0, (actualWorkMinutes - expectedWorkMinutes) / 60).toFixed(2));

        return { is_late, work_hours, overtime_hours };
    } catch {
        return { is_late: false, work_hours: 0, overtime_hours: 0 };
    }
}

/**
 * Convert HH:MM or HH:MM:SS to minutes
 */
function timeToMinutes(timeStr: string): number {
    try {
        const parts = timeStr.split(':').map(p => parseInt(p) || 0);
        return (parts[0] || 0) * 60 + (parts[1] || 0);
    } catch {
        return 0;
    }
}

/**
 * Validate attendance data before saving
 */
export function validateAttendanceData(data: any[]): {
    valid: any[];
    invalid: Array<{ row: any; error: string }>;
} {
    const valid: any[] = [];
    const invalid: Array<{ row: any; error: string }> = [];

    data.forEach((row, index) => {
        const errors: string[] = [];

        // Required: employee_code or employee_id
        if (!row.employee_code?.toString().trim() && !row.employee_id?.toString().trim()) {
            errors.push('Kode atau ID karyawan harus ada');
        }

        // Required: date
        if (!row.date) {
            errors.push('Tanggal harus ada');
        }

        // Required: check_in or check_out
        if (!row.check_in && !row.check_out) {
            errors.push('Check-in atau Check-out harus ada');
        }

        // Validate date format YYYY-MM-DD
        if (row.date && !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
            errors.push(`Format tanggal tidak valid: ${row.date}`);
        }

        // Validate time format HH:MM:SS
        if (row.check_in && !/^\d{2}:\d{2}(:\d{2})?$/.test(row.check_in)) {
            errors.push(`Format jam masuk tidak valid: ${row.check_in}`);
        }

        if (row.check_out && !/^\d{2}:\d{2}(:\d{2})?$/.test(row.check_out)) {
            errors.push(`Format jam keluar tidak valid: ${row.check_out}`);
        }

        // Check if check_out is after check_in
        if (row.check_in && row.check_out) {
            const checkInMin = timeToMinutes(row.check_in);
            const checkOutMin = timeToMinutes(row.check_out);
            if (checkOutMin <= checkInMin) {
                errors.push('Jam keluar harus setelah jam masuk');
            }
        }

        if (errors.length > 0) {
            invalid.push({
                row: { ...row, rowIndex: index + 1 },
                error: errors.join('; ')
            });
        } else {
            valid.push(row);
        }
    });

    return { valid, invalid };
}

/**
 * Merge duplicate attendance records (same employee, same date)
 * Keeps earliest check-in and latest check-out
 */
export function mergeDuplicateAttendance(data: any[]): any[] {
    const merged: { [key: string]: any } = {};

    data.forEach(record => {
        const key = `${record.employee_code || record.employee_id}_${record.date}`;

        if (!merged[key]) {
            merged[key] = { ...record };
        } else {
            // Keep earliest check-in
            if (record.check_in && (!merged[key].check_in || timeToMinutes(record.check_in) < timeToMinutes(merged[key].check_in))) {
                merged[key].check_in = record.check_in;
            }

            // Keep latest check-out
            if (record.check_out && (!merged[key].check_out || timeToMinutes(record.check_out) > timeToMinutes(merged[key].check_out))) {
                merged[key].check_out = record.check_out;
            }

            // Mark as present if either has check-in/out
            if (record.check_in || record.check_out) {
                merged[key].is_present = true;
            }
        }
    });

    return Object.values(merged);
}

/**
 * Generate CSV template for fingerprint import
 */
export function generateImportTemplate(): string {
    const headers = ['EmpCode', 'Date', 'CheckIn', 'CheckOut'];
    const sampleData = [
        ['EMP001', '2024-01-15', '08:30:00', '17:00:00'],
        ['EMP002', '2024-01-15', '08:45:00', '17:15:00'],
        ['EMP003', '2024-01-15', '-', '-'],
    ];

    const rows = [
        headers.join(','),
        ...sampleData.map(row => row.join(','))
    ];

    return rows.join('\n');
}

/**
 * Download CSV template
 */
export function downloadTemplate(): void {
    const template = generateImportTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_template.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Parse CSV text directly (alternative to file upload)
 */
export function parseCSVText(csvText: string, hasHeader: boolean = true): {
    headers: string[];
    data: string[][];
} {
    const lines = csvText.trim().split('\n');
    const headers = hasHeader ? lines[0].split(',').map(h => h.trim()) : [];
    const startIndex = hasHeader ? 1 : 0;

    const data = lines.slice(startIndex).map(line =>
        line.split(',').map(cell => cell.trim())
    );

    return { headers, data };
}