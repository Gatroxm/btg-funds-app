import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsListComponent } from './funds-list.component';

describe('FundsList', () => {
  let component: FundsListComponent;
  let fixture: ComponentFixture<FundsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
