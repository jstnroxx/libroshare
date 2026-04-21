import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { Auth } from '../services/auth';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();

  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/refresh/') && !req.url.includes('/logout/') && !req.url.includes('/login/') && !req.url.includes('/register/')) {
        if (!isRefreshing) {
          isRefreshing = true

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;

              const newAccess = response.access;

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccess}`
                }
              });

              return next(retryReq)
            }),
            catchError((refreshError) => {
              isRefreshing = false;

              if (localStorage.getItem('refresh_token')) {
                authService.logout();
              }

              router.navigate(['/login']);

              return throwError(() => refreshError);
            })
          );  
        }
      }

      return throwError(() => error);
    })
  );
};