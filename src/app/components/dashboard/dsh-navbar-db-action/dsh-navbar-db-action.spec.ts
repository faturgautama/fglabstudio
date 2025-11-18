import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshNavbarDbAction } from './dsh-navbar-db-action';

describe('DshNavbarDbAction', () => {
  let component: DshNavbarDbAction;
  let fixture: ComponentFixture<DshNavbarDbAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshNavbarDbAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshNavbarDbAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
