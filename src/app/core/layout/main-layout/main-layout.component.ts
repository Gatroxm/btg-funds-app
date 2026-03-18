import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
      <!-- Navbar -->
      <header class="bg-[#002f5d] text-white shadow-md">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-8">
            <h1 class="text-xl font-bold tracking-wide flex items-center gap-2">
              <span class="w-8 h-8 bg-white text-[#002f5d] rounded flex items-center justify-center font-black">B</span>
              BTG Pactual
            </h1>
            <nav class="hidden md:flex gap-2">
              <a 
                routerLink="/funds" 
                routerLinkActive="bg-white/10"
                class="px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-sm font-medium">
                Fondos Disponibles
              </a>
              <a 
                routerLink="/transactions" 
                routerLinkActive="bg-white/10"
                class="px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-sm font-medium">
                Historial
              </a>
            </nav>
          </div>
          
          <div class="flex items-center gap-4 bg-[#001f3f] px-4 py-2 rounded-lg border border-white/10">
            <div class="hidden sm:block text-right">
              <p class="text-xs text-blue-200">Saldo Disponible</p>
              <ng-container *ngIf="userService.user$ | async as user; else loading">
                <p class="font-medium text-sm">{{ user.balance | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
              </ng-container>
              <ng-template #loading>
                <div class="h-5 w-24 bg-white/10 animate-pulse rounded mt-1"></div>
              </ng-template>
            </div>
            
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="bg-gray-100 border-t border-gray-200 py-6 mt-auto">
         <div class="container mx-auto px-4 text-center text-sm text-gray-500">
            &copy; {{ currentYear }} BTG Pactual - App de simulación. Todos los derechos reservados.
         </div>
      </footer>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  userService = inject(UserService);
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.userService.loadUser();
  }
}
