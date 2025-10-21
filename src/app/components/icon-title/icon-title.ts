import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-icon-title',
  imports: [
    ButtonModule
  ],
  standalone: true,
  templateUrl: './icon-title.html',
  styleUrl: './icon-title.scss'
})
export class IconTitle implements OnDestroy {

  Destroy$ = new Subject();

  @Input('props') props!: { icon: string, title: string, description: string };

  constructor(
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute
      .data
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        const { icon, title, description } = result;
        this.props = { icon, title, description };
      });
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }
}
