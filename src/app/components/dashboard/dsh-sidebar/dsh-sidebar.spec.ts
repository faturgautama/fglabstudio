import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshSidebar } from './dsh-sidebar';

describe('DshSidebar', () => {
  let component: DshSidebar;
  let fixture: ComponentFixture<DshSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshSidebar]
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
