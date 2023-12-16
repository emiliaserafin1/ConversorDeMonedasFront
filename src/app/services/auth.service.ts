import { Injectable, Signal, WritableSignal, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { LoginData, RegisterData } from '../interfaces/user';
import { API } from '../constants/api';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    this.token.set(localStorage.getItem('token'));
  }
  router = inject(Router);
  token: WritableSignal<string | null> = signal(null);

  async login(loginData: LoginData) {
    try {
      const res = await fetch(API + 'authentication/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) return false;
      const tokenRecibido = await res.text();
      console.log('LOGUEANDO', tokenRecibido);
      localStorage.setItem('token', tokenRecibido);
      this.token.set(tokenRecibido);
      return true;
    } catch {
      return false;
    }
  }

  async register(registerData: RegisterData) {
    const res = await fetch(API + 'User', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });
    console.log('REGISTRANDO', res);
    return res;
  }

  logOut() {
    this.token.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId() {
    const token = this.getToken();

    if (!token) {
      console.error('No token found');  // Agrega un registro de consola en caso de que no haya ningún token.
      return null;
    }

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);

        // Verifica si el token tiene la claim "sub" (ID de usuario) y devuelve su valor como un número
        if (decodedToken && decodedToken.sub) {
            const userId = parseInt(decodedToken.sub as string);
            console.log('User ID:', userId);  // Agrega un registro de consola para el ID del usuario.
            return userId;
        } else {
            console.error('No user ID found in token');  // Agrega un registro de consola si no se encuentra el ID del usuario en el token.
            return null;
        }
    } catch (error) {
        console.error('Error decoding token:', error);  // Agrega un registro de consola si hay un error al decodificar el token.
        return null;
    }
}

  
  
}