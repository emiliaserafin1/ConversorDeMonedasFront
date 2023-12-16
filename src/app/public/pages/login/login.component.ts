import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService = inject(AuthService)
  router = inject(Router);
  errorLogin = signal(false);
  cargando = signal(false);
  passwordVisible = false;


  passwordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  loginData: LoginData= {
    Email:"",
    Password: ""
  }

  login(){
    this.errorLogin.set(false);
    this.cargando.set(true);
    this.authService.login(this.loginData).then(res => {
      if(res) this.router.navigate(["/"]);
      else {
        this.errorLogin.set(true)
      };
      this.cargando.set(false);
    });
  }
}

