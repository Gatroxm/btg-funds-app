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
  templateUrl: './fund-subscribe.component.html'
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
