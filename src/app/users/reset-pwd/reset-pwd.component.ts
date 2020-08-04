import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth.service';

import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/model/user';
import { Status } from 'src/app/model/status';

const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.css']
})

export class ResetPwdComponent implements OnInit {

  // fontawesome icons
  faBack = faAngleLeft;

  errorMessage: string;

  loggedInUser: User;
  user: User;

  adminReset: boolean;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private authService: AuthService,
    private changeDedectionService: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  
    const id = +this.route.snapshot.paramMap.get('id');
    console.log('UserId: ' + id);

    this.adminReset = (id !== 0);

    this.loggedInUser = this.authService.getUser();
    this.user = new User();

    if (id === 0) {
      this.user.id = this.loggedInUser.id;
    } else {
      this.user.id = id;
    }
  }

  resetPassword() {
    this.errorMessage = '';

    console.log('Old Password: ' + this.user.password);
    console.log('New Password: ' + this.user.newPassword);
    console.log('Confirm Password: ' + this.user.confirmPassword);

    if(this.user.newPassword !== this.user.confirmPassword) {
      this.errorMessage = 'NEW password and CONFIRM password do NOT match';
      return;
    }

    if(this.adminReset) {

      this.userService.resetPassword(this.user)
        .subscribe(
          res => {
            console.log('Password changed successfully ' + res);
            alert('Password successfully reset');
            this.location.back();
          },
          err => {
            console.log('Change password Error: ', err.error);
            this.errorMessage = err.error;
          });

    } else {

      this.userService.changePassword(this.user)
        .subscribe(
          res => {
            console.log('Password changed successfully ' + res);
            alert('Password successfully reset');

            let status = new Status();
            status.id = 1;
            status.name = 'ACTIVE';
            this.authService.changeStatus(status);


            this.router.navigate(['/default']).then(res => this.changeDedectionService.detectChanges());
          },
          err => {
            console.log('Change password Error: ', err.error);
            this.errorMessage = err.error;
          });

    }
  }


  onBack() {
    console.log("Back Clicked");
    this.location.back();
  }  
}
