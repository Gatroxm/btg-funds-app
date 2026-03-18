import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'funds', pathMatch: 'full' },
      { 
        path: 'funds', 
        loadComponent: () => import('./features/funds/pages/funds-list/funds-list.component').then(m => m.FundsListComponent)
      },
      { 
        path: 'subscribe/:id', 
        loadComponent: () => import('./features/funds/pages/fund-subscribe/fund-subscribe.component').then(m => m.FundSubscribeComponent)
      },
      { 
        path: 'transactions', 
        loadComponent: () => import('./features/transactions/pages/transactions-list/transactions-list.component').then(m => m.TransactionsListComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'funds' }
];
