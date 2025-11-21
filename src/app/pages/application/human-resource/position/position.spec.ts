import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Position } from './position';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Position', () => {
  let component: Position;
  let fixture: ComponentFixture<Position>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Position, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Position);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
