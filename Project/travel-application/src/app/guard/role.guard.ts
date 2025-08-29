import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user || !user.role) {
    router.navigate(['']); 
    return false;
  }

  const expectedRole = route.data['role'];
  if (user.role === expectedRole) {
    return true;
  } else {
    router.navigate(['']); 
    return false;
  }
};
