import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (
    private authService: AuthService,
    private router: Router
  ) { }

  async canActivate(): Promise<boolean> {
    console.log('Auth guard');
    if(this.authService.loggedIn()) {
      console.log('Auth guard - verify token');
      return await this.authService.verifyToken()
        .pipe(
          map(
            res => {
              console.log('Auth.guard.ts - Valid token - new token: ', res.token);
              localStorage.setItem('token', res.token);
              return true;
            },
            err => {
              console.log('Auth.guard.ts - Token verification error', err);
              this.router.navigate(['/login']);
              return false;
            }
          )
        ).toPromise()
        .catch(
          err => {
            console.log('Auth .guard.ts - Token verification Error: ', err);
            this.router.navigate(['/login']);
            return false;
          }
        )
     }

  }
  
}


