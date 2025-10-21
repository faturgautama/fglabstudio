import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Departement } from './departement';

describe('Departement', () => {
  let component: Departement;
  let fixture: ComponentFixture<Departement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Departement]
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
