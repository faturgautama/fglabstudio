import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshNavbar } from './dsh-navbar';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('DshNavbar', () => {
  let component: DshNavbar;
  let fixture: ComponentFixture<DshNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshNavbar, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
