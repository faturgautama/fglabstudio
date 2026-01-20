import { Component } from '@angular/core';
import { LandingLayout } from "../../components/landing-layout/landing-layout";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-terms-and-conditions',
    imports: [
        LandingLayout,
        TranslatePipe
    ],
    templateUrl: './terms-and-conditions.html',
    styleUrl: './terms-and-conditions.scss',
    standalone: true
})
export class TermsAndConditions {

}
