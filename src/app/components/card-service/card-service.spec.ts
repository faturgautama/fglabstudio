import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardService } from './card-service';

describe('CardService', () => {
  let component: CardService;
  let fixture: ComponentFixture<CardService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
