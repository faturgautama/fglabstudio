import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshNavbarSearch } from './dsh-navbar-search';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('DshNavbarSearch', () => {
  let component: DshNavbarSearch;
  let fixture: ComponentFixture<DshNavbarSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshNavbarSearch, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshNavbarSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
