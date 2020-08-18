import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  roles: string[] = [];

  constructor(private tokenStorage: TokenStorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<any> {

    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getUser().roles;
      if (this.roles.includes('ROLE_ADMIN')) {
        return true;
      } else {
        this.router.navigateByUrl('/home');
      }
    } else {
      this.router.navigateByUrl('/signin');
    }
  }
}
