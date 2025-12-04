import { Component } from '@angular/core';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { StockOverviewComponent } from './stock-overview/stock-overview.component';

@Component({
    selector: 'app-stock-card',
    imports: [
        DshBaseLayout,
        StockOverviewComponent
    ],
    standalone: true,
    templateUrl: './stock-card.html',
    styleUrl: './stock-card.scss'
})
export class StockCard {
    // Stock Summary component will handle all the logic
}
