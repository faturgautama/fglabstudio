import { Component, Input } from '@angular/core';
import { DshSidebar } from '../dsh-sidebar/dsh-sidebar';
import { DshNavbar } from '../dsh-navbar/dsh-navbar';
import { IconTitle } from "../../icon-title/icon-title";
import { DshLoading } from "../dsh-loading/dsh-loading";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-dsh-base-layout',
  imports: [
    DshSidebar,
    DshNavbar,
    IconTitle,
    DshLoading,
    ToastModule,
    ConfirmDialogModule
  ],
  standalone: true,
  templateUrl: './dsh-base-layout.html',
  styleUrl: './dsh-base-layout.scss'
})
export class DshBaseLayout {

}
