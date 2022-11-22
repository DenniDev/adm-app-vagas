import { AuthService} from './verificador';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private auth: AuthService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  
  {
    return this.auth.user$
    .pipe(
      take(1),
      map(user => user ? true : false),
      tap(isLoggedIn =>
        {
         if(!isLoggedIn)
         {
          this._router.navigate(['/login']);
          return false;
         } 

         return true;
        })
      );
  }

}