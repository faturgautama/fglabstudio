import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTitle } from './icon-title';
import { commonTestProviders, commonTestImports } from '../../../test-helpers';

describe('IconTitle', () => {
  let component: IconTitle;
  let fixture: ComponentFixture<IconTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTitle, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconTitle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
