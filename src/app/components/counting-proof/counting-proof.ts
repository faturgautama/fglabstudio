import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-counting-proof',
  imports: [],
  templateUrl: './counting-proof.html',
  styleUrl: './counting-proof.scss',
  standalone: true
})
export class CountingProof implements OnInit, OnDestroy {

  @Input('value') value: number;

  @Input('label') label: string;

  speed = 30;
  duration = 2000;
  current = 0;
  private sub?: Subscription;

  constructor() {
    this.value = 0;
    this.label = "";
  }

  ngOnInit(): void {
    const steps = Math.ceil(this.duration / this.speed);
    const increment = this.value / steps;
    let count = 0;

    this.sub = interval(this.speed)
      .pipe(takeWhile(() => count < steps))
      .subscribe(() => {
        count++;
        this.current = Math.round(increment * count);

        // ensure exact target at the end
        if (count >= steps) {
          this.current = this.value;
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
