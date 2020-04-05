import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, Location } from '@angular/common';

import { UserService } from 'src/app/user.service';
import { LookupService } from 'src/app/lookup.service';
import { AuthService } from 'src/app/auth.service';
import { dynamicSort, toggleSort } from 'src/app/shared/dynamic-sort';

import { User } from 'src/app/model/user';
import { Role } from 'src/app/model/role';
import { Status } from 'src/app/model/status';
import { Locale } from 'src/app/model/locale';
import { Country } from 'src/app/model/country';
import { UserSearch } from 'src/app/model/user_search';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { faToggleOff } from '@fortawesome/free-solid-svg-icons';

import { FormGroup, FormBuilder } from '@angular/forms';

declare var $: any; // jQuery

const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [DatePipe]
})

export class UsersComponent implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;

  userSearchStr: '';
  userSearch: UserSearch;

  // fontawesome icons
  faSearch = faSearch;
  faUser = faUser;
  faUserPlus = faUserPlus;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;

  locale: string;
  allUsers: User[];   // stores all users
  users: User[];      // stores all users filtered by screen filters

  roles: Role[];
  status: Status[];
  locales: Locale[];
  countries: Country[];
  
  sortOrderStatus = 0;
  sortOrderEmail = 0;
  sortOrderRole = 0;
  sortOrderName = 0;
  sortOrderAddr1 = 0;
  sortOrderAddr2 = 0;
  sortOrderCity = 0;
  sortOrderCounty = 0;
  sortOrderCountry = 0;
  sortOrderLocale = 0;
  sortOrderCreated = 0;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userService: UserService,
    private lookupService: LookupService,
    private datePipe: DatePipe,
    private location: Location
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

    const loggedInUser = this.auth.getUser();
    this.locale = loggedInUser.locale.abbr;

    $('#allCheckbox').change(function () {
      $('tbody tr td input[type="checkbox"]').prop('checked', $(this).prop('checked'));
    });

    this.userSearch = new UserSearch();
    this.userSearch.searchStr = [];
  }

  getUsers(): void {
    this.userService.getUsers().subscribe (
      users => {
        console.log({ users });

        let tempUsers: User[] = clone(users);
        tempUsers = this.setUserValues(tempUsers);
        
        this.allUsers = tempUsers;
        this.users = tempUsers;
      }
    );
  }

  formatDate(date: Date) {
    // Checks if date is null or undefined (=== strict check for null only)
    if (date == null) {
      return null;
    }

    const pipe = new DatePipe(this.locale);

    const dateStr = pipe.transform(date, 'short');
    // Format the date to DD/MM/YYYY
    // const dateStr = date.substr(8, 2) + '/' + date.substr(5, 2) + '/' + date.substr(0, 4) + " " + date.substr(11, 2) + ":" + date.substr(14, 2) + ":" + date.substr(17, 2);
    // alert('Date Before: ' + date + '   Date String: ' + dateStr);
    return dateStr;
  }

  setUserValues(filteredProperties: User[]): User[] {
    console.log('setUserValues - start');
    filteredProperties.forEach(user => {
      // console.log('User: ', { user });

      user.roleSort = user.role.name;
      user.statusSort = user.status.name;
      user.localeSort = user.locale.name;
      user.countrySort = user.country.name;
      user.insertDateStr = this.formatDate(user.insertDate);

      user.lastLoggedInStr = this.formatDate(user.lastLoggedIn);
      user.lastActivityStr = this.formatDate(user.lastActivity);

      if(user.addr1 == null) { user.addr1 = ''; }
      if(user.addr2 == null) { user.addr2 = ''; }
      if(user.city == null) { user.city = ''; }
      if(user.county == null) { user.county = ''; }
    });

    console.log('setClientValues - end');
    return filteredProperties;
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

  private filter() {
    this.users = [];

    const tempUsers = [];

    this.allUsers.forEach((userObject: User, rowIndex: number) => {
      // console.log(userObject);

      // If userObject is null, undefined or empty - ignore
      if (userObject != null && Object.keys(userObject).length !== 0) {

        let includeUser = true;

        if (this.userSearch.searchStr.length > 0) {
          // Check Status, email, role, name, addr1, addr2, city, county, country, locale
          // against any part of the search string
          this.userSearch.searchStr.forEach((searchSubStr) => {
            includeUser = includeUser
              && ((userObject.role.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.email.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.status.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.addr1.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.addr2.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.city.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.county.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.country.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.locale.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (userObject.locale.abbr.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                );
          });
        }

        // console.log('includeUser: ' + includeUser);
        if (includeUser) {
          tempUsers.push(userObject);
        }
      }
    });

    this.users = tempUsers;
  }

  public doSearch() {
    console.log('userSearchStr: ' + this.userSearchStr);
    this.userSearch.searchStr = this.userSearchStr.split(' ');
    this.filter();
  } 
  
  public sortByStatus() {
    this.sortOrderStatus = toggleSort(this.sortOrderStatus);
    this.users.sort(dynamicSort('statusSort', this.sortOrderStatus));
  }

  public sortByEmail() {
    this.sortOrderEmail = toggleSort(this.sortOrderEmail);
    this.users.sort(dynamicSort('email', this.sortOrderEmail));
  }

  public sortByRole() {
    this.sortOrderRole = toggleSort(this.sortOrderRole);
    this.users.sort(dynamicSort('roleSort', this.sortOrderRole));
  }

  public sortByName() {
    this.sortOrderName = toggleSort(this.sortOrderName);
    this.users.sort(dynamicSort('name', this.sortOrderName));
  }

  public sortByAddr1() {
    this.sortOrderAddr1 = toggleSort(this.sortOrderAddr1);
    this.users.sort(dynamicSort('addr1', this.sortOrderAddr1));
  }

  public sortByAddr2() {
    this.sortOrderAddr2 = toggleSort(this.sortOrderAddr2);
    this.users.sort(dynamicSort('addr2', this.sortOrderAddr2));
  }

  public sortByCity() {
    this.sortOrderCity = toggleSort(this.sortOrderCity);
    this.users.sort(dynamicSort('city', this.sortOrderCity));
  }

  public sortByCounty() {
    this.sortOrderCounty = toggleSort(this.sortOrderCounty);
    this.users.sort(dynamicSort('county', this.sortOrderCounty));
  }

  public sortByCountry() {
    this.sortOrderCountry = toggleSort(this.sortOrderCountry);
    this.users.sort(dynamicSort('countrySort', this.sortOrderCountry));
  }

  public sortByLocale() {
    this.sortOrderLocale = toggleSort(this.sortOrderLocale);
    this.users.sort(dynamicSort('localeSort', this.sortOrderLocale));
  }

  public sortByCreated() {
    this.sortOrderCreated = toggleSort(this.sortOrderCreated);
    this.users.sort(dynamicSort('insertDate', this.sortOrderCreated));
  }

 
}
