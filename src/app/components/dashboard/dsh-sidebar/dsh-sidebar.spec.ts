import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshSidebar } from './dsh-sidebar';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('DshSidebar', () => {
  let component: DshSidebar;
  let fixture: ComponentFixture<DshSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshSidebar, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
