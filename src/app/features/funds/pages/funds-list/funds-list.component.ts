import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FundsService } from '../../../../services/funds.service';
import { Fund } from '../../../../models/fund.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-funds-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './funds-list.component.html'
})
export class FundsListComponent implements OnInit {
  fundsService = inject(FundsService);
  funds$!: Observable<Fund[]>;

  ngOnInit() {
    this.funds$ = this.fundsService.getFunds();
  }
}
