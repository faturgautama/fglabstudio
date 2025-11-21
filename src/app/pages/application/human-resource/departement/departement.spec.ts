import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Departement } from './departement';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Departement', () => {
  let component: Departement;
  let fixture: ComponentFixture<Departement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Departement, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Departement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
