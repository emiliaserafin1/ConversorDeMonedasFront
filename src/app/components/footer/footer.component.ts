import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  auth = inject(AuthService);
  router = inject(Router);

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
