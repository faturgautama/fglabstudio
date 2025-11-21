import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonTestProviders, commonTestImports } from '../../../test-helpers';
import { CardProduct } from './card-product';

describe('CardProduct', () => {
  let component: CardProduct;
  let fixture: ComponentFixture<CardProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProduct, ...commonTestImports],
      providers: [...commonTestProviders]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardProduct);
    component = fixture.componentInstance;

    // Set required input
    component.props = {
      id: '1',
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
      discount_price: 90,
      category: 'Test Category',
      image: 'test.jpg',
      published_at: '2024-01-01'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
