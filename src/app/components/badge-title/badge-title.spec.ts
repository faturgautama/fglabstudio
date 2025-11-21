import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeTitle } from './badge-title';
import { commonTestProviders, commonTestImports } from '../../../test-helpers';

describe('BadgeTitle', () => {
  let component: BadgeTitle;
  let fixture: ComponentFixture<BadgeTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeTitle, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeTitle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
