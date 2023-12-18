import {  inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const usuarioSinLoguear: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
    if(auth.token()){
    const router = inject(Router);
    router.navigate(['conversor']);
    return false;
  }
  return true;
};