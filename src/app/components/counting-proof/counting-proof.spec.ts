import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountingProof } from './counting-proof';
import { commonTestProviders, commonTestImports } from '../../../test-helpers';

describe('CountingProof', () => {
  let component: CountingProof;
  let fixture: ComponentFixture<CountingProof>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountingProof, ...commonTestImports]
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
