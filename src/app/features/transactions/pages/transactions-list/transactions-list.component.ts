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
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Historial de Transacciones</h2>
        <p class="text-sm text-gray-500 mt-1">Revisa tus suscripciones activas y cancelaciones</p>
      </div>
      
      <div class="p-6" *ngIf="transactions.length === 0 && !isLoading">
        <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
           <h3 class="text-lg font-medium text-gray-900">No hay transacciones</h3>
           <p class="text-gray-500 text-sm mt-1">Aún no te has suscrito a ningún fondo.</p>
        </div>
      </div>

      <div class="overflow-x-auto" *ngIf="transactions.length > 0">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-y border-gray-100 text-sm">
              <th class="py-4 px-6 font-semibold text-gray-600">Fecha</th>
              <th class="py-4 px-6 font-semibold text-gray-600">Tipo</th>
              <th class="py-4 px-6 font-semibold text-gray-600">Fondo</th>
              <th class="py-4 px-6 font-semibold text-gray-600 text-right">Monto</th>
              <th class="py-4 px-6 font-semibold text-gray-600 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let t of transactions" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 px-6 text-sm text-gray-600">{{ t.date | date:'medium' }}</td>
              <td class="py-4 px-6">
                 <span class="px-2.5 py-1 rounded text-xs font-bold tracking-wide flex items-center w-fit gap-1"
                       [ngClass]="t.type === 'SUBSCRIBE' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'">
                   <!-- Icon logic based on type -->
                   <svg *ngIf="t.type==='SUBSCRIBE'" class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   <svg *ngIf="t.type==='CANCEL'" class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                   {{ t.type === 'SUBSCRIBE' ? 'SUSCRIPCIÓN' : 'CANCELACIÓN' }}
                 </span>
              </td>
              <td class="py-4 px-6 font-medium text-gray-800">{{ t.fundName }}</td>
              <td class="py-4 px-6 text-right font-bold"
                  [ngClass]="t.type === 'SUBSCRIBE' ? 'text-gray-900' : 'text-emerald-600'">
                {{ t.type === 'CANCEL' ? '+' : '-' }}{{ t.amount | currency:'COP':'symbol-narrow':'1.0-0' }}
              </td>
              <td class="py-4 px-6 text-center">
                 <button *ngIf="t.type === 'SUBSCRIBE'" 
                         (click)="cancelSubscription(t)"
                         [disabled]="isProcessing"
                         class="text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 px-4 py-2 rounded-lg transition-colors border border-rose-100 hover:border-transparent disabled:opacity-50">
                    Cancelar
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
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
