import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FundsService } from '../../../../services/funds.service';
import { UserService } from '../../../../services/user.service';
import { TransactionsService } from '../../../../services/transactions.service';
import { ToastrService } from 'ngx-toastr';
import { Fund } from '../../../../models/fund.model';
import { User } from '../../../../models/user.model';
import { switchMap, take, Subscription } from 'rxjs';

@Component({
  selector: 'app-fund-subscribe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-[#002f5d] to-[#004a93] p-8 text-white relative flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold tracking-tight mb-2">Suscripción de Fondo</h2>
          <p class="text-blue-100 text-sm">Ingresa el monto que deseas invertir</p>
        </div>
        <a routerLink="/funds" class="text-white/80 hover:text-white transition-colors bg-white/10 p-2 rounded-full cursor-pointer hover:bg-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </a>
      </div>

      <div class="p-8" *ngIf="fund">
        
        <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex justify-between items-center mb-6">
           <div>
             <h3 class="text-xl font-semibold text-[#002f5d]">{{ fund.name }}</h3>
             <div class="flex gap-2 mt-2">
                <span class="px-2 py-0.5 rounded text-xs font-semibold"
                      [ngClass]="fund.category === 'FPV' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'">
                  {{ fund.category }}
                </span>
                <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                  Monto Mínimo: {{ fund.minAmount | currency:'COP':'symbol-narrow':'1.0-0' }}
                </span>
             </div>
           </div>
           <div class="text-right">
             <span class="block text-sm text-gray-500 font-medium">Rentabilidad</span>
             <span class="text-2xl font-bold text-emerald-600">+{{ fund.profitability }}%</span>
           </div>
        </div>

        <div class="flex justify-between items-center mb-4 px-2">
            <span class="text-gray-600 font-medium">Saldo Disponible:</span>
            <span class="font-bold text-lg text-[#002f5d]">{{ currentUser?.balance | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
        </div>

        <form [formGroup]="subscribeForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label for="amount" class="block text-sm font-semibold text-gray-700">Monto a Suscribir</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input type="number" id="amount" formControlName="amount" 
                     class="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002f5d] focus:border-[#002f5d] transition-shadow text-lg font-medium outline-none" 
                     placeholder="0">
            </div>
            
            <div *ngIf="subscribeForm.get('amount')?.touched && subscribeForm.get('amount')?.invalid" class="text-rose-500 text-xs font-medium mt-1">
              <span *ngIf="subscribeForm.get('amount')?.errors?.['required']">El monto es requerido.</span>
              <span *ngIf="subscribeForm.get('amount')?.errors?.['min']">El monto mínimo para este fondo es {{ fund.minAmount | currency:'COP':'symbol-narrow':'1.0-0' }}.</span>
              <span *ngIf="subscribeForm.get('amount')?.errors?.['insufficientFunds']">No tienes saldo suficiente para esta operación.</span>
            </div>
          </div>
          
          <div class="space-y-3 pt-2 border-t border-gray-100">
             <label class="block text-sm font-semibold text-gray-700">Canal de Notificación</label>
             <div class="flex gap-4">
               <label class="flex items-center gap-2 cursor-pointer">
                 <input type="radio" formControlName="notificationPreference" value="EMAIL" 
                        class="w-4 h-4 text-[#002f5d] border-gray-300 focus:ring-[#002f5d]">
                 <span class="text-sm font-medium text-gray-700">Correo Electrónico</span>
               </label>
               <label class="flex items-center gap-2 cursor-pointer">
                 <input type="radio" formControlName="notificationPreference" value="SMS" 
                        class="w-4 h-4 text-[#002f5d] border-gray-300 focus:ring-[#002f5d]">
                 <span class="text-sm font-medium text-gray-700">SMS (Mensaje de texto)</span>
               </label>
             </div>
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="subscribeForm.invalid || isSubmitting"
                    class="w-full bg-[#002f5d] hover:bg-[#001f3f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98]">
              {{ isSubmitting ? 'Procesando...' : 'Confirmar Suscripción' }}
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="!fund && !isLoading" class="p-8 text-center text-gray-500 font-medium">
        No se encontró el fondo especificado.
      </div>
      
      <div *ngIf="isLoading" class="p-8 flex justify-center">
         <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002f5d]"></div>
      </div>
    </div>
  `
})
export class FundSubscribeComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  fundsService = inject(FundsService);
  userService = inject(UserService);
  transactionsService = inject(TransactionsService);
  toastr = inject(ToastrService);

  fund: Fund | null = null;
  currentUser: User | null = null;
  isLoading = true;
  isSubmitting = false;
  subscribeForm!: FormGroup;
  private subs = new Subscription();

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.subs.add(
        this.fundsService.getFundById(id).subscribe({
          next: (fund) => {
            this.fund = fund;
            this.initForm();
            this.isLoading = false;
          },
          error: () => {
             this.isLoading = false;
             this.toastr.error('No se pudo cargar el fondo');
          }
        })
      );
    }
    
    this.subs.add(
      this.userService.user$.subscribe(user => {
         this.currentUser = user;
         if (this.subscribeForm) {
            this.subscribeForm.get('amount')?.updateValueAndValidity();
         }
      })
    );
  }

  initForm() {
    this.subscribeForm = this.fb.group({
      amount: [
        this.fund?.minAmount || 0, 
        [Validators.required, Validators.min(this.fund?.minAmount || 0)]
      ],
      notificationPreference: [
        'EMAIL',
        [Validators.required]
      ]
    }, { validators: this.balanceValidator.bind(this) });
  }

  balanceValidator(group: FormGroup) {
    const amount = group.get('amount')?.value;
    if (this.currentUser && amount > this.currentUser.balance) {
      group.get('amount')?.setErrors({ insufficientFunds: true });
      return { insufficientFunds: true };
    }
    return null;
  }

  onSubmit() {
    if (this.subscribeForm.invalid || !this.fund || !this.currentUser) return;
    
    this.isSubmitting = true;
    const amount = this.subscribeForm.value.amount;
    const notificationPreference = this.subscribeForm.value.notificationPreference;

    // Deduct balance
    this.userService.updateBalance(-amount).pipe(
      take(1),
      switchMap(() => {
        // Create transaction
        return this.transactionsService.addTransaction({
          fundId: this.fund!.id,
          fundName: this.fund!.name,
          amount: amount,
          type: 'SUBSCRIBE'
        });
      })
    ).subscribe({
      next: () => {
        const notifMsg = notificationPreference === 'EMAIL' ? 'correo electrónico' : 'SMS';
        this.toastr.success(`Suscripción exitosa a ${this.fund!.name}. Te notificaremos por ${notifMsg}.`);
        this.router.navigate(['/transactions']);
      },
      error: () => {
        this.toastr.error('Error al procesar la suscripción');
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
