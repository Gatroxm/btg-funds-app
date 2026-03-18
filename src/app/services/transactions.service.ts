import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    });
  }
}
