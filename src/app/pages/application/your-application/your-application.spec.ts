import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourApplication } from './your-application';

describe('YourApplication', () => {
  let component: YourApplication;
  let fixture: ComponentFixture<YourApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
