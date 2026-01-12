import { Component, inject, OnInit } from '@angular/core';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Store } from '@ngxs/store';
import { POSTransactionAction, POSTransactionState } from '../../../../store/point-of-sales';

@Component({
    selector: 'app-pos-home',
    standalone: true,
    imports: [
        CommonModule,
        DshBaseLayout,
        CurrencyPipe,
        ChartModule,
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home implements OnInit {

    private _store = inject(Store);

    Summary = {
        total_sales: 0,
        total_transactions: 0
    };

    TopProducts: any[] = [];

    SalesChart = {
        datasource: {} as any,
        options: null as any
    };

    ngOnInit(): void {
        this.loadTodaySummary();
        this.loadTopProducts();
        this.initChart();
    }

    private loadTodaySummary() {
        this._store.dispatch(new POSTransactionAction.GetTodaySummary());
        this._store.select(POSTransactionState.getTodaySummary).subscribe(summary => {
            if (summary) {
                this.Summary = summary;
            }
        });
    }

    private loadTopProducts() {
        this._store.dispatch(new POSTransactionAction.GetTopProducts(5));
        this._store.select(POSTransactionState.getTopProducts).subscribe(products => {
            if (products) {
                this.TopProducts = products;
            }
        });
    }

    private initChart() {
        const last7Days = this.getLast7Days();

        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--p-text-color');
        const textColorSecondary = getComputedStyle(document.documentElement).getPropertyValue('--p-text-muted-color');
        const surfaceBorder = getComputedStyle(document.documentElement).getPropertyValue('--p-content-border-color');

        // TODO: Load actual sales data from store
        this.SalesChart.datasource = {
            labels: last7Days.map(d => d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })),
            datasets: [
                {
                    label: 'Penjualan',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#0ea5e9',
                    borderColor: '#0284c7',
                    borderWidth: 1
                }
            ]
        };

        this.SalesChart.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    private getLast7Days(): Date[] {
        const days: Date[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    }
}
