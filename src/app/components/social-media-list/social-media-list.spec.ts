import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaList } from './social-media-list';
import { commonTestProviders, commonTestImports } from '../../../test-helpers';

describe('SocialMediaList', () => {
  let component: SocialMediaList;
  let fixture: ComponentFixture<SocialMediaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaList, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
