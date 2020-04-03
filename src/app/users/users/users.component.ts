import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/user.service';
import { LookupService } from 'src/app/lookup.service';

import { User } from 'src/app/model/user';
import { Role } from 'src/app/model/role';
import { Status } from 'src/app/model/status';
import { Locale } from 'src/app/model/locale';
import { Country } from 'src/app/model/country';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  // fontawesome icons
  faSearch = faSearch;
  faUser = faUser;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faBan = faBan;

  allUsers: User[];   // stores all users
  users: User[];      // stores all users filtered by screen filters

  roles: Role[];
  status: Status[];
  locales: Locale[];
  countries: Country[];
   
  constructor(
    private userService: UserService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    console.log('User List - Init - start');

    Promise.all([
      this.getRoles(),
      this.getStatus(),
      this.getLocales(),
      this.getCountries()
    ]).then(values => {
      this.getUsers();
    });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe (
      users => {
        console.log({ users });

        let tempUsers: User[] = JSON.parse(JSON.stringify(users));
        
        this.allUsers = tempUsers;
        this.users = tempUsers;
      }
    );
  }

  async getRoles() {
    this.roles = (await (this.lookupService.getRoles())) as Role[];
  }

  async getStatus() {
    this.status = (await (this.lookupService.getStatus())) as Status[];
  }
  
  async getLocales() {
    this.locales = (await (this.lookupService.getLocales())) as Locale[];
  }
  
  async getCountries() {
    this.countries = (await (this.lookupService.getCountries())) as Country[];
  }
  
}
