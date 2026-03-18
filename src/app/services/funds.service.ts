import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Fund } from '../models/fund.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/funds`;

  getFunds(): Observable<Fund[]> {
    return this.http.get<Fund[]>(this.apiUrl);
  }

  getFundById(id: string): Observable<Fund> {
    return this.http.get<Fund>(`${this.apiUrl}/${id}`);
  }
}
