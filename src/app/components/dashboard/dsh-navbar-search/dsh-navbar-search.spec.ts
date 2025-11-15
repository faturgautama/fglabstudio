import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshNavbarSearch } from './dsh-navbar-search';

describe('DshNavbarSearch', () => {
  let component: DshNavbarSearch;
  let fixture: ComponentFixture<DshNavbarSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshNavbarSearch]
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
