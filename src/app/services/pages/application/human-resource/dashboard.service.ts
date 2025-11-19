import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { BehaviorSubject, forkJoin, from, map } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private databaseService = inject(DatabaseService);

  _totalPayroll = new BehaviorSubject<number>(0);
  _birthdayEmployees = new BehaviorSubject<any[]>([]);
  _employeeDatasource = new BehaviorSubject<any[]>([]);

  getEmployeeCount() {
    return from(this.databaseService.db.employees.toArray())
      .pipe(
        map((result) => {
          const filtered = result.filter(employee => employee.is_active);

          let totalpayroll = 0;
          let birthday_employees = [];

          for (const employee of filtered) {
            const birthday = employee.birth_date ? new Date(employee.birth_date) : null;

            if (birthday && (birthday?.getMonth() === new Date().getMonth()) && (birthday?.getDate() > new Date().getDate())) {
              birthday_employees.push({
                id: employee.id,
                full_name: employee.full_name,
                birthday: birthday
              });
            }

            totalpayroll += employee.salary ? parseFloat(employee.salary as any) : 0;
          };

          this._totalPayroll.next(totalpayroll);
          this._birthdayEmployees.next(birthday_employees);
          this._employeeDatasource.next(filtered);

          return filtered.length;
        })
      )
  };

  getDepartmentCount() {
    return from(this.databaseService.db.department.toArray())
      .pipe(
        map((result) => {
          const filtered = result.filter(departement => departement.is_active);
          return filtered.length;
        })
      )
  };

  getWorkingTimes(start_date: string, end_date: string) {
    const getColorFromClass = (() => {
      const cache: Record<string, string> = {};
      return (className: string) => {
        if (cache[className]) return cache[className];
        const el = document.createElement('div');
        el.className = className;
        document.body.appendChild(el);
        const color = getComputedStyle(el).backgroundColor;
        document.body.removeChild(el);
        cache[className] = color;
        return color;
      };
    })();

    const dates = this.generateDateRange(start_date, end_date);

    const observables = dates.map(dateStr => {
      const currentDate = formatDate(new Date(dateStr), 'yyyy-MM-dd', 'EN');

      return forkJoin({
        attendance: from(
          this.databaseService.db.attendance
            .filter((a: any) => {
              const d = formatDate(new Date(a.date), 'yyyy-MM-dd', 'EN');
              return d == currentDate
            })
            .toArray()
        ),
        overtime: from(
          this.databaseService.db.overtime
            .filter((o: any) => {
              const d = formatDate(new Date(o.date), 'yyyy-MM-dd', 'EN');
              return d == currentDate
            })
            .toArray()
        ),
        workingTimesLength: from(this.databaseService.db.shift.toArray())
          .pipe(
            map((result) => {
              if (result.length === 0) {
                return 8;
              };

              if (result[0].start_time && result[0].end_time) {
                const start_date = new Date(result[0].start_time);
                const end_date = new Date(result[0].end_time);

                const break_time = result[0].break_duration ? parseFloat(result[0].break_duration as any) : 0;

                const diffMs = end_date.getTime() - start_date.getTime();
                const diffHours = diffMs / (1000 * 60 * 60) - (break_time / 60);

                return diffHours;
              };

              return 0;
            })
          )
      }).pipe(
        map(({ attendance, overtime, workingTimesLength }) => {
          // calculate work hours from check_in / check_out
          const totalWorkHours = attendance.reduce((sum, a: any) => {
            if (typeof a.working_hours === 'number') return sum + a.working_hours;

            if (!a.check_in) return sum; // no check_in -> skip

            const checkIn = new Date(a.check_in);
            const checkOut = a.check_out ? new Date(a.check_out) : null;

            if (checkOut) {
              const diffH = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
              return sum + (Math.max(0, diffH) > workingTimesLength ? workingTimesLength : Math.max(0, diffH));
            }

            const recordDate = a.date ? new Date(a.date) : null;

            if (recordDate && this.isSameDay(recordDate, new Date(currentDate))) {
              const now = new Date();
              const diffH = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
              return sum + (Math.max(0, diffH) > workingTimesLength ? workingTimesLength : Math.max(0, diffH));
            }

            return sum + 8;
          }, 0);

          const totalOvertimeHours = overtime.reduce((sum, o: any) => {
            if (typeof o.total_hours === 'number') return sum + o.total_hours;
            return sum;
          }, 0);

          // optionally round to 2 decimals or integer for chart
          const round = (v: number) => Math.round(v * 100) / 100; // 2 decimals
          return {
            date: dateStr,
            totalWorkHours: round(totalWorkHours),
            totalOvertimeHours: round(totalOvertimeHours)
          };
        })
      );
    });

    return forkJoin(observables).pipe(
      map(results => {
        const labels = results.map(r => formatDate(new Date(r.date), 'dd MMM', 'en-US'));
        const workData = results.map(r => r.totalWorkHours);
        const overtimeData = results.map(r => r.totalOvertimeHours);

        return {
          labels,
          datasets: [
            {
              type: 'bar',
              label: 'Jam Kerja',
              backgroundColor: getColorFromClass('bg-sky-600'),
              data: workData
            },
            {
              type: 'bar',
              label: 'Overtime',
              backgroundColor: getColorFromClass('bg-fuchsia-200'),
              data: overtimeData
            }
          ]
        };
      })
    );
  }

  private generateDateRange(start_date: string, end_date: string): string[] {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const dates: string[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

}
