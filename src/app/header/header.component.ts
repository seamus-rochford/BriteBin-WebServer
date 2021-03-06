import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './../auth.service';
import { User } from '../model/user';
import { Global } from 'src/app/model/global';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayName = '';
  roleName = '';
  logo = './assets/images/logo-pel.png';
  currUser: User;

  public isUserDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private global: Global
    ) { }

  ngOnInit(): void {
    // Get current user from AuthService
    this.currUser = this.authService.getUser();

    // Return the displayName
    if (this.currUser !== null) {
      this.displayName = (this.currUser.name).trim() + ' (' + (this.currUser.role.name).trim() + ')';
      console.log('Display Name: ' + this.displayName);

      console.log(this.currUser);
    } 
  }

  logout() {
    this.currUser = null;
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
        this.displayName = (currUser.name).trim() + ' (' + (currUser.role.name).trim() + ')';
        console.log('this.displayName: ' + this.displayName);
      } else {
        this.displayName = "";
        console.log('this.displayName: no displayName');
      }
    }
    return this.displayName;
  }

  public getRoleName() {
      // Get current user from AuthService
      const currUser = this.authService.getUser();

      if (currUser !== null) {
        // Return the displayName
        this.roleName = (currUser.role.name).trim();
        console.log('this.roleName: ' + this.roleName);
      } else {
        this.roleName = "";
        console.log('this.roleName: no roleName');
      }

      return this.roleName;
  }

  public mainMenuVisible() {
    let visible = false;
    this.currUser = this.authService.getUser();
    if (this.currUser != null) {
      console.log(this.currUser);
      if (this.currUser.status.id === this.global.userStatus.ACTIVE) {
        visible = true;
      }
    }
    console.log('Main Menu Visible: ' + visible);
    return visible; 
  }

  public maintenaceMenuVisible() {
    let currentRoleId = 100;
    // Get current user from AuthService
    const currUser = this.authService.getUser();

    if (currUser !== null && currUser.status.id == 1) {
      // Return the current Role Id
      currentRoleId = currUser.role.id;
    }

    return currentRoleId < 2;
  }
}

