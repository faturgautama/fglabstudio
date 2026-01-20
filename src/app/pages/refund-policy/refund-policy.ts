import { Component } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-refund-policy',
    imports: [
        LandingLayout,
        TranslatePipe
    ],
    templateUrl: './refund-policy.html',
    styleUrl: './refund-policy.scss',
    standalone: true
})
export class RefundPolicy {

}
