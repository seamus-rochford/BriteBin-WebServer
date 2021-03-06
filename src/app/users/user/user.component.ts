import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'src/app/model/user';
import { UserService }  from 'src/app/user.service';
import { LookupService } from 'src/app/lookup.service';
import { AuthService } from 'src/app/auth.service';
import { Role } from 'src/app/model/role';
import { Status } from 'src/app/model/status';
import { Locale } from 'src/app/model/locale';
import { Country } from 'src/app/model/country';
import { Global } from 'src/app/model/global';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  
  faUser = faUser;
  faClose = faTimes;
  faBack = faAngleLeft;
  faSave = faSave;
  faExclamation = faExclamation;
  faEye = faEye;

  roles: Role[];
  allPossibleParents: User[];
  possibleParents: User[];
  status: Status[];
  locales: Locale[];
  countries: Country[];

  defaultStatus = new Status();

  loggedInUser: User;
  locale: string;

  user: User;

  errorMsg = '';
  displayWaitingDialog = false;

  constructor(
    private route: ActivatedRoute,
    private lookupService: LookupService,
    private userService: UserService,
    private authService: AuthService,
    private location: Location,
    public router: Router,
    public global: Global
  ) { }

  ngOnInit(): void {
    console.log('user.ngOnInt');
    this.displayWaitingDialog = true;

    const id = +this.route.snapshot.paramMap.get('id');
    console.log('UserId: ' + id);

    Promise.all([
      this.getStatus(),
      this.getLoggedInInfo(),
      this.getUser(id)
    ]).then(values => {
      this.getRoles();
      this.getPossibleParents();
    });

    this.getLocales();
    this.getCountries();

    console.log('user.ngOnInit - end');
  }

  async getLoggedInInfo() {
    this.loggedInUser = this.authService.getUser();
    console.log(this.loggedInUser);
    this.locale = this.loggedInUser.locale.abbr;
    console.log('Locale: ' + this.locale);

    return this.loggedInUser;
  }

  async getRoles() {
    const tempRoles = (await (this.lookupService.getRoles())) as Role[];
    console.log('tempRoles: ');
    console.log(tempRoles);

    if (this.loggedInUser.role.id === 0) {
      this.roles = tempRoles;
    } else {
      this.roles = [];
      for (let i = 0; i < tempRoles.length; i++) {
        if (tempRoles[i].id > this.loggedInUser.role.id) {
          this.roles.push(tempRoles[i]);
        }
      }
    }
    console.log('Roles: ');
    console.log(this.roles);
  }

  async getPossibleParents() {
    const tempUsers = (await (this.userService.getPossibleParents())) as User[];
    console.log('tempUsers: ');
    console.log(tempUsers);

    this.allPossibleParents = tempUsers;

    console.log('Possible Parents: ');
    console.log(this.allPossibleParents);

    // do a delay of 1 second so getUser has completed
    if (this.user.role == null) {
      let count = 0;
      while (this.user.role == null && count++ < 1000) {
        setTimeout(() => console.log('this.user.role not loaded'), 10);
      }
      if (this.user.role == null) {
        setTimeout(() => this.filterPossibleParents(this.user.role), 500);
      } else {
        this.filterPossibleParents(this.user.role);
      }
    } else {
      this.filterPossibleParents(this.user.role);
    }
  }

  async getStatus() {
    this.status = (await (this.lookupService.getStatus())) as Status[];
    console.log('this.status: ' + JSON.stringify(this.status));
    this.setDefaultStatus();

    return this.status;
  }

  setDefaultStatus() {
    for(let i = 0; i < this.status.length; i++) {
      if (this.status[i].id === 0) {
        this.defaultStatus = this.status[i];
      }
    }
    console.log('Default status');
    console.log(this.defaultStatus);
  }

  async getLocales() {
    this.locales = (await (this.lookupService.getLocales())) as Locale[];
  }

  async getCountries() {
    this.countries = (await (this.lookupService.getCountries())) as Country[];
  }

  public compareById(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  public compareByAbbr(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.abbr === obj2.abbr : obj1 === obj2;
  }
  
	async getUser(id) {
    if (id > 0) {
      this.userService.getUser(id)
        .subscribe(user => {
          console.log('Back from API: ');
          console.log({ user });

          let tempUser: User = clone(user);
          tempUser = this.setUserValues(tempUser);

          this.user = tempUser;
          this.displayWaitingDialog = false;
          return this.user;
        });      
    } else {

      this.displayWaitingDialog = false;

      this.user = new User();
      this.user.id = 0;
      
      this.user.status = this.defaultStatus;
      this.user.parent = new User();
      this.user.parent.id = this.loggedInUser.id;
      this.user.parent.name = this.loggedInUser.name;

      return this.user;
    }
  }  

  formatDate(date: Date) {
    // Checks if date is null or undefined (=== strict check for null only)
    if (date == null) {
      return null;
    }

    const pipe = new DatePipe(this.locale);

    const dateStr = pipe.transform(date, 'short');

    return dateStr;
  }

  setUserValues(user: User): User {
    console.log('setUserValues - start');

    user.roleSort = user.role.name;
    user.parentSort = user.parent.name;
    user.statusSort = user.status.name;
    user.localeSort = user.locale.name;
    user.countrySort = user.country.name;
    user.insertDateStr = this.formatDate(user.insertDate);
    user.modifiedDateStr = this.formatDate(user.modifiedDate);

    user.lastLoggedInStr = this.formatDate(user.lastLoggedIn);
    user.lastActivityStr = this.formatDate(user.lastActivity);

    if (user.email == null) { user.email =''; }
    if (user.name == null) { user.name = ''; }
    if (user.addr1 == null) { user.addr1 = ''; }
    if (user.addr2 == null) { user.addr2 = ''; }
    if (user.city == null) { user.city = ''; }
    if (user.county == null) { user.county = ''; }
    if (user.postcode == null) { user.postcode = ''; }

    if (user.role == null) { user.role = new Role(); }
    if (user.locale == null) { user.locale = new Locale(); }
    if (user.country == null) { user.country = new Country(); }
    if (user.status == null) { user.status = new Status(); }

    console.log('setUserValues - end');
    this.displayWaitingDialog = false;
    return user;
  }

  validate() {
    if (this.user.id == 0) {
      // new user
      if (this.user.newPassword == null || this.user.newPassword == '') {
        this.errorMsg = "Must enter password";
        return false;
      }
      if (this.user.confirmPassword == null || this.user.confirmPassword == '') {
        this.errorMsg = "Must enter Confirm Password";
        return false;
      }
      if (this.user.newPassword !== this.user.confirmPassword) {
        this.errorMsg = "Password and Confirm Password do NOT match";
        return false;
      }
      this.user.password = this.user.newPassword;
    }
    if (this.user.email == null || this.user.email == '') {
      this.errorMsg = "Must input email";
      return false;
    }
    if (this.user.name == null || this.user.name == '') {
      this.errorMsg = "Must input name";
      return false;
    }
    if (this.user.parent.id == null || this.user.parent.id == 0) {
      this.errorMsg = "Must select a parent";
      return false;
    }
    if (this.user.country.id == null || this.user.country.id == 0) {
      this.errorMsg = "Must select a country";
      return false;
    }
    if (this.user.role.id == null || this.user.role.id < 0) {
      this.errorMsg = "Must select a role";
      return false;
    }
    if (this.user.locale.abbr == null || this.user.locale.abbr == '') {
      this.errorMsg = "Must select a locale";
      return false;
    }
    if (this.user.binLevelAlert == null || this.user.binLevelAlert == 0) {
      this.errorMsg = "Must input Bin Alert Value";
      return false;
    }
    return true;
  }


  onSave() {
    console.log('onSave clicked');
    if (!this.validate()) {
      alert('Fix input before saving');
    } else {
      this.errorMsg = '';
      console.log(this.user);
      this.displayWaitingDialog = true;
      this.userService.saveUser(this.user)
        .subscribe(
          user => {
            console.log('After save: ', user);

            user => user;
            this.displayWaitingDialog = false;
            this.location.back();
          },
          err => {
            this.displayWaitingDialog = false;
            console.log('Save Error: ', err);
            this.errorMsg = 'Failed to save - ' + err;
          });
    }
  }

  private filterPossibleParents(role) {
    // Filter possible parents allowed based on this role
    // e.g. Admin can only have an admin parent
    // Distributer can only have an admin parent
    // Corporate User can only have and Admin or dist parent
    // Customer can have admin, dist or Corporate parent
    // technician can only have Admin or dist parent
    // driver can only have Corporate or Customer parent

    this.possibleParents = [];

    for (let i = 0; i < this.allPossibleParents.length; i++) {
      console.log(this.allPossibleParents[i].role.id);
      if (role.id === this.global.userRoles.ADMIN || role.id === this.global.userRoles.DISTRIBUTER) {  // Admin or distributer
        if (this.allPossibleParents[i].role.id === this.global.userRoles.ADMIN) {
          this.possibleParents.push(this.allPossibleParents[i]);
        }
      } else if (role.id === this.global.userRoles.CORPORATE) {  // Corporate Customer
        if (this.allPossibleParents[i].role.id <= this.global.userRoles.DISTRIBUTER) {
          this.possibleParents.push(this.allPossibleParents[i]);
        }
      } else if (role.id === this.global.userRoles.CUSTOMER) {  // Customer
        if (this.allPossibleParents[i].role.id <= this.global.userRoles.CORPORATE) {
          this.possibleParents.push(this.allPossibleParents[i]);
        }
      } else if (role.id === this.global.userRoles.TECHNICIAN) {  // Technician
        if (this.allPossibleParents[i].role.id <= this.global.userRoles.DISTRIBUTER) {
          this.possibleParents.push(this.allPossibleParents[i]);
        }
      } else if (role.id === this.global.userRoles.DRIVER) {  // Driver
        if (this.allPossibleParents[i].role.id === this.global.userRoles.CORPORATE || this.allPossibleParents[i].role.id === this.global.userRoles.CUSTOMER) {
          this.possibleParents.push(this.allPossibleParents[i]);
        }
      }
    }

    console.log('Available Parents: ');
    console.log(this.possibleParents);
  }

  public onRoleChange(newRole): void {  
    console.log(newRole);

    this.filterPossibleParents(newRole);

    console.log('new Possible Parents');
    console.log(this.possibleParents);
  }

  onResetPassword() {
    // Reset user password
    // this.router.navigate(['/reset', { id: this.user.id }]);
    this.router.navigateByUrl('resetPwd/' + this.user.id);    
  }

	onBack(): void {
    console.log('Clicked back');
    this.location.back();
  }  
  
}
