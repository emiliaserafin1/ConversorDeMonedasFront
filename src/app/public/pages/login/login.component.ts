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
    this.cargando.set(true); // Inicia el cargador
    this.errorLogin.set(false);
    this.authService.login(this.loginData).then(res => {
      if(res) {
        setTimeout(() => {
          this.cargando.set(false); // Detiene el cargador después de 2 segundos
          this.router.navigate(["/conversor"]);
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.cargando.set(false);
          this.errorLogin.set(true); // Detiene el cargador después de 1 segundo si hay un error
        }, 2000);
      };
    })
    .catch(error => {
      console.error(error);
      this.cargando.set(false);
      this.errorLogin.set(true);
    });
  }
}

