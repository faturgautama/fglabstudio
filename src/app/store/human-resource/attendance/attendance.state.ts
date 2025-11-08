import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { AttendanceAction } from "./attendance.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { AttendanceService } from "../../../services/pages/application/human-resource/attendance.service";

export interface AttendanceStateModel {
    data: EmployeeModel.IAttendance[];
    single: EmployeeModel.IAttendance | null | undefined;
}

@State<AttendanceStateModel>({
    name: 'attendance',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class AttendanceState implements NgxsOnInit {

    constructor(
        private _attendanceService: AttendanceService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new AttendanceAction.GetAttendance());
    }

    @Selector()
    static getAll(state: AttendanceStateModel) {
        return state.data;
    }

    @Action(AttendanceAction.GetAttendance)
    getAttendance(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService.getAll(payload.filter, payload.sort).pipe(
            tap((result) => {
                const state = ctx.getState();

                // 🔹 Fungsi bantu untuk hitung keterlambatan
                const calculateLatenessDescription = (checkIn: string, shiftStart: string): string => {
                    if (!checkIn || !shiftStart) return '';

                    const checkInDate = new Date(checkIn);
                    const shiftStartDate = new Date(shiftStart);

                    // Ambil jam & menit (abaikan tanggal)
                    const checkInMinutes = checkInDate.getHours() * 60 + checkInDate.getMinutes();
                    const shiftStartMinutes = shiftStartDate.getHours() * 60 + shiftStartDate.getMinutes();

                    const diffMinutes = checkInMinutes - shiftStartMinutes;

                    // Jika tidak terlambat
                    if (diffMinutes <= 0) return '';

                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;

                    // Format hasil keterlambatan
                    if (hours > 0 && minutes > 0) return `${hours} jam ${minutes} menit`;
                    if (hours > 0) return `${hours} jam`;
                    return `${minutes} menit`;
                };

                // 🔹 Tambahkan field description ke setiap record
                const updatedData = result.map((item: any) => {
                    const description = calculateLatenessDescription(item.check_in, item.shift?.start_time);
                    return { ...item, description };
                });

                // 🔹 Update state
                ctx.setState({
                    ...state,
                    data: updatedData
                });
            })
        );
    }


    @Action(AttendanceAction.GetByIdAttendance)
    getById(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .getById(payload.payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result
                    })
                })
            )
    }

    @Action(AttendanceAction.AddAttendance)
    add(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .add(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }

    @Action(AttendanceAction.BulkAddAttendance)
    bulkAdd(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .bulkAdd(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }

    @Action(AttendanceAction.UpdateAttendance)
    update(ctx: StateContext<AttendanceStateModel>, payload: any) {
        console.log("payload =>", payload);

        return this._attendanceService
            .update(payload.payload.id, payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }

    @Action(AttendanceAction.DeleteAttendance)
    delete(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }
}