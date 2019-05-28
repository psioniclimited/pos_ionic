import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountModalPage } from './discount-modal.page';

describe('DiscountModalPage', () => {
  let component: DiscountModalPage;
  let fixture: ComponentFixture<DiscountModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
