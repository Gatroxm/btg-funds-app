import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSubscribe } from './fund-subscribe';

describe('FundSubscribe', () => {
  let component: FundSubscribe;
  let fixture: ComponentFixture<FundSubscribe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundSubscribe],
    }).compileComponents();

    fixture = TestBed.createComponent(FundSubscribe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
