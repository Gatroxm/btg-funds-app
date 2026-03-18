import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsList } from './funds-list';

describe('FundsList', () => {
  let component: FundsList;
  let fixture: ComponentFixture<FundsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundsList],
    }).compileComponents();

    fixture = TestBed.createComponent(FundsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
