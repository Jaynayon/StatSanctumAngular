import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  return authService.isAuthenticated$().pipe(
    take(1), // Complete after first emission
    map(isAuthenticated => {
      if (isAuthenticated) return true;
      router.navigate(['']);
      return false;
    })
  )
};
