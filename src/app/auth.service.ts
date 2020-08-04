import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private loginUrl = `${environment.apiUrl}/user/login`;
  private verifyUrl = `${environment.apiUrl}/user/verifyToken`;

  private user: User;

  constructor(
    private http: HttpClient,
    private router: Router) { }

    loginUser(user) {
      console.log('authService: loginUser: ' + this.loginUrl);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      return this.http.post<any>(this.loginUrl, user, httpOptions);
    }

    loggedIn() {
      // console.log('loggedIn: ' + !!localStorage.getItem('token') && !!localStorage.getItem('user'));
      return !!localStorage.getItem('token') && !!localStorage.getItem('user');
    }
  
    getToken() {
      return localStorage.getItem('token');
    }
  
    getUser() {
      // console.log(this.user);
      this.user = JSON.parse(localStorage.getItem('user'));
      return this.user;
    }

    getLocale() {
      this.user = JSON.parse(localStorage.getItem('user'));
      return this.user.locale;
    }
  
    verifyToken() {
      console.log('auth.service.ts - VerifyToken');
      return this.http.get<any>(this.verifyUrl);
    }

    changeStatus(status) {
      this.user.status = status;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  
    logoutUser() {
      // localStorage.removeItem('token');
      localStorage.clear();
  
      this.router.navigate(['/login']);
    }
  
}
