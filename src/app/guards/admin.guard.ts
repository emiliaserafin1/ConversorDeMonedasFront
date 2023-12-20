import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const userRole = auth.getRole();
  if (userRole != 'Admin') {
    return false;
  }
  return true;
};
