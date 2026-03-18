import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSubscribeComponent } from './fund-subscribe.component';

describe('FundSubscribe', () => {
  let component: FundSubscribeComponent;
  let fixture: ComponentFixture<FundSubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundSubscribeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundSubscribeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
