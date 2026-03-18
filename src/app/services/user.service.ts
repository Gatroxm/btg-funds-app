import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private apiUrl = `${environment.apiUrl}/user`;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  loadUser(): void {
    this.http.get<User>(this.apiUrl).subscribe({
      next: (user) => this.userSubject.next(user),
      error: (err) => {
        console.error('Error loading user', err);
        this.toastr.error('Error cargando los datos del usuario');
      }
    });
  }

  getUser(): User | null {
    return this.userSubject.getValue();
  }

  updateBalance(amount: number): Observable<User> {
    const currentUser = this.getUser();
    if (!currentUser) return throwError(() => new Error('No user data'));

    const newBalance = currentUser.balance + amount;
    if (newBalance < 0) {
      this.toastr.error('Saldo insuficiente', 'Error');
      return throwError(() => new Error('Insufficient balance'));
    }

    return this.http.patch<User>(this.apiUrl, { balance: newBalance }).pipe(
      tap(updatedUser => {
        this.userSubject.next(updatedUser);
      }),
      catchError(err => {
        this.toastr.error('No se pudo actualizar el saldo', 'Error');
        return throwError(() => err);
      })
    );
  }
}
