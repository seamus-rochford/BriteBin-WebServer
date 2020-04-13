import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { User } from '../model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayName = '';
  logo = './assets/images/logo.png';
  currUser: User;

  public isUserDropdownOpen = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Get current user from AuthService
    this.currUser = this.authService.getUser();

    // Return the displayName
    if (this.currUser !== null) {
      this.displayName = (this.currUser.name).trim();
      console.log('Display Name: ' + this.displayName);

      console.log(this.currUser);
    }  }

  logout() {
    this.displayName = '';
    this.isUserDropdownOpen = false;
    console.log('header - Logout');
    this.authService.logoutUser();
  }


  public onLogoutDropdownClicked() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    console.log(`isuserDropdownOpen set to ${this.isUserDropdownOpen}`);
  }

  public loggedIn() {
    return this.authService.loggedIn();
  }

  public getDisplayName() {
    if (this.displayName === '') {
      // Get current user from AuthService
      const currUser = this.authService.getUser();

      if (currUser !== null) {
        // Return the displayName
        this.displayName = (currUser.name).trim();
        console.log('this.displayName: ' + this.displayName);
      } else {
        this.displayName = "";
      }
    }
    return this.displayName;
  }

  public maintenaceMenuVisible() {
    let currentRoleId = 100;
    // Get current user from AuthService
    const currUser = this.authService.getUser();

    if (currUser !== null) {
      // Return the displayName
      currentRoleId = currUser.role.id;
    }

    return currentRoleId < 3;
  }
}

