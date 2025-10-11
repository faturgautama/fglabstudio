import { Component } from '@angular/core';
import { DshSidebar } from '../dsh-sidebar/dsh-sidebar';
import { DshNavbar } from '../dsh-navbar/dsh-navbar';

@Component({
  selector: 'app-dsh-base-layout',
  imports: [
    DshSidebar,
    DshNavbar,
  ],
  standalone: true,
  templateUrl: './dsh-base-layout.html',
  styleUrl: './dsh-base-layout.scss'
})
export class DshBaseLayout {

}
