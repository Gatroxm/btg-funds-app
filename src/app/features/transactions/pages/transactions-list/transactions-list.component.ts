import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../../../services/transactions.service';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Transaction } from '../../../../models/transaction.model';
import { Observable, switchMap, take, finalize } from 'rxjs';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions-list.component.html'
})
export class TransactionsListComponent implements OnInit {
  transactionsService = inject(TransactionsService);
  userService = inject(UserService);
  toastr = inject(ToastrService);

  transactions: Transaction[] = [];
  isLoading = true;
  isProcessing = false;

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading = true;
    this.transactionsService.getTransactions().subscribe({
      next: (data) => {
        // Sort by date descending
        this.transactions = data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  get activeSubscriptions(): Transaction[] {
    return this.transactions.filter(t => t.type === 'SUBSCRIBE' && !this.isCancelled(t));
  }

  isCancelled(subTx: Transaction): boolean {
    // Check if there is a CANCEL transaction for the same fund logically
    // Since we don't store a parentId, a simple approach is checking if there's any CANCEL
    // transaction for this fundId that occurred AFTER this subscription.
    // However, the cleanest logic for this simulation is: if there's a cancel for this fund, 
    // we consider the subscription cancelled (assuming 1 active sub per fund at a time).
    const subTime = new Date(subTx.date).getTime();
    return this.transactions.some(
      t => t.type === 'CANCEL' && t.fundId === subTx.fundId && new Date(t.date).getTime() > subTime
    );
  }

  cancelSubscription(t: Transaction) {
    if (!confirm(`¿Estás seguro de cancelar la suscripción a ${t.fundName} por ${t.amount}?`)) return;
    
    this.isProcessing = true;
    // Add amount back to balance
    this.userService.updateBalance(t.amount).pipe(
      take(1),
      switchMap(() => {
        // Create cancellation transaction
        return this.transactionsService.addTransaction({
          fundId: t.fundId,
          fundName: t.fundName,
          amount: t.amount,
          type: 'CANCEL'
        });
      }),
      finalize(() => this.isProcessing = false)
    ).subscribe({
      next: () => {
        this.toastr.success(`Suscripción de ${t.fundName} cancelada`);
        this.loadTransactions();
      },
      error: () => {
        this.toastr.error('Error al cancelar la suscripción');
      }
    });
  }
}
