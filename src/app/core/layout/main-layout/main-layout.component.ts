import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule, CurrencyPipe, AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgIf,
    AsyncPipe,
    CurrencyPipe
  ],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {
  userService = inject(UserService);
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.userService.loadUser();
  }
}