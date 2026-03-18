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
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Fondos Disponibles</h2>
          <p class="text-sm text-gray-500 mt-1">Explora y suscríbete a nuestros fondos de inversión (FPV y FIC)</p>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-sm md:text-base">
              <th class="py-4 px-6 font-semibold text-gray-700">Nombre del Fondo</th>
              <th class="py-4 px-6 font-semibold text-gray-700 text-center">Categoría</th>
              <th class="py-4 px-6 font-semibold text-gray-700 text-right">Monto Mínimo</th>
              <th class="py-4 px-6 font-semibold text-gray-700 text-center">Rentabilidad</th>
              <th class="py-4 px-6 font-semibold text-gray-700 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <ng-container *ngIf="funds$ | async as funds; else loading">
              <tr *ngFor="let fund of funds" class="hover:bg-blue-50/50 transition-colors group">
                <td class="py-4 px-6">
                  <span class="font-medium text-gray-900">{{ fund.name }}</span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
                        [ngClass]="fund.category === 'FPV' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'">
                    {{ fund.category }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right font-medium text-gray-700">
                  {{ fund.minAmount | currency:'COP':'symbol-narrow':'1.0-0' }}
                </td>
                <td class="py-4 px-6 text-center">
                  <span class="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                    +{{ fund.profitability }}%
                  </span>
                </td>
                <td class="py-4 px-6 text-center">
                  <a [routerLink]="['/subscribe', fund.id]" 
                     class="inline-block bg-[#002f5d] hover:bg-[#001f3f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-transform transform active:scale-95 shadow-sm">
                    Suscribirse
                  </a>
                </td>
              </tr>
            </ng-container>
            <ng-template #loading>
              <tr *ngFor="let i of [1,2,3,4,5]">
                <td colspan="5" class="py-6 px-6">
                  <div class="animate-pulse flex space-x-4">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </td>
              </tr>
            </ng-template>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FundsListComponent implements OnInit {
  fundsService = inject(FundsService);
  funds$!: Observable<Fund[]>;

  ngOnInit() {
    this.funds$ = this.fundsService.getFunds();
  }
}
