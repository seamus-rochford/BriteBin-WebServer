import { Router } from '@angular/router';
import { User } from './../model/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';

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
    // localStorage.clear();
  }

  loginUser() {
    console.log('Before Login: ', this.loginUserData);

    this.auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          console.log('After login: ', res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', res.user);

          // Successfully logged in - navigate to the default page
          this.router.navigate(['/latestReadings']);
        },
        err => {
          console.log('Login Error: ', err);
          this.errorMessage = 'Invalid login credentials';
        }
      );
  }

}

