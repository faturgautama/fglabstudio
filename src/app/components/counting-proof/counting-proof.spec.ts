import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountingProof } from './counting-proof';

describe('CountingProof', () => {
  let component: CountingProof;
  let fixture: ComponentFixture<CountingProof>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountingProof]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountingProof);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
