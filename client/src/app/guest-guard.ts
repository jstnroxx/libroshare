import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core'; 

import { Auth } from './services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.parseUrl('/my-books');
  }

  return true;
};
