import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isSmallScreen = false;
  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Small])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }
  auth = inject(AuthService);
  router = inject(Router);

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAdmin(): boolean {
    return this.auth.getRole() === 'Admin';
  }

  toggleMenu() {
    // Implementa la lógica para mostrar/ocultar el menú lateral en dispositivos pequeños
  }
}
