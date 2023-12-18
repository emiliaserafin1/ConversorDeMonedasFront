import { Component, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterData } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  authService = inject(AuthService)
  router = inject(Router);
  errorRegister: WritableSignal<boolean> = signal(false)
  cargando = signal(false);

  registerData: RegisterData = {
    Username: "",
    Email: "",
    FirstName: "",
    LastName: "",
    Password: "",
  }

  validate(){
    if (!this.registerData.Username || this.registerData.Username.length < 4) {
      return false;
    }
    if (!this.registerData.Email || !this.registerData.Email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
      return false;
    }
    if (!this.registerData.FirstName || this.registerData.FirstName.length < 3) {
      return false;
    }
    if (!this.registerData.LastName || this.registerData.LastName.length < 3) {
      return false;
    }
    if (!this.registerData.Password || this.registerData.Password.length < 8) {
      return false;
    }
    return true;
  }

  async register(){
    // Validaciones
    if (!this.validate()) {
      this.errorRegister.set(true);
      return;
    }
    // Si todas las validaciones pasan, entonces procede con el registro
    this.errorRegister.set(true);
    this.cargando.set(true);
    try{
      const res = await this.authService.register(this.registerData);
      if(res.ok) {
        setTimeout(() => {
          this.cargando.set(false);
          this.router.navigate(["/subscription"]);
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.cargando.set(false);
          this.errorRegister.set(true); // Detiene el cargador después de 1 segundo si hay un error
        }, 2000);
      }
    } catch(err) {
      console.warn('Error registrando', err)
    }
    this.cargando.set(false);
  }
}
