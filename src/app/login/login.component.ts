import { Router, NavigationExtras } from '@angular/router';
import { User } from './../model/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage = '';
  // tslint:disable: variable-name
  loginUserData: User = new User();

  constructor(
    private auth: AuthService,
    private router: Router) {
  }
  ngOnInit(): void {
    console.log('login page');
    localStorage.clear();
  }

  loginUser() {
    console.log('Before Login: ', this.loginUserData);

    this.auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          console.log('After login: ', res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', res.user);

          const user = JSON.parse(res.user);
          if(user.status.id === 0) {
            // User is active but needs to change their password
            console.log('User is Registered but not yet active - goto resetPassword');

            this.router.navigateByUrl('resetPwd/0');    // 0 = current user
          } else {
            // Successfully logged in - navigate to the default page
            // this.router.navigate(['/latestReadings']);
            console.log('Successful login - goto default page');
            this.router.navigate(['/default']);
          }
        },
        err => {
          console.log('Login Error: ', err);
          this.errorMessage = 'Invalid login credentials';
        }
      );
  }

}

