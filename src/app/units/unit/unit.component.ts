import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Unit } from 'src/app/model/unit';
import { User } from 'src/app/model/user';
import { UnitService }  from 'src/app/unit.service';
import { LookupService } from 'src/app/lookup.service';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { DeviceType } from 'src/app/model/device_type';
import { BinType } from 'src/app/model/bin_type';
import { ContentType } from 'src/app/model/content_type';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';


const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
  providers: [DatePipe]
})

export class UnitComponent implements OnInit {

  faBin = faTrash;
  faClose = faTimes;
  faBack = faAngleLeft;
  faSave = faSave;
  faExclamation = faExclamation;
  faList = faList;

  owners: User[];
  deviceTypes: DeviceType[];
  binTypes: BinType[];
  contentTypes: ContentType[];

  loggedInUser: User;
  locale: string;

  unit: Unit;

  errorMsg = '';
  displayWaitingDialog = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService,
    private unitService: UnitService,
    private authService: AuthService,
    private userService: UserService,
    private location: Location
  ) { }

  ngOnInit(): void {
    console.log('unit.ngOnInt');

    const id = +this.route.snapshot.paramMap.get('id');
    console.log('UnitId: ' + id);

    Promise.all([
      this.getLoggedInInfo(),
      this.getDeviceTypes(),
      this.getBinTypes(),
      this.getContentTypes(),
      this.getOwners()
    ]).then(values =>{
        this.getUnit(id)
    });

    console.log('unit.ngOnInit - end');
  }

  async getLoggedInInfo() {
    this.loggedInUser = this.authService.getUser();
    console.log(this.loggedInUser);
    this.locale = this.loggedInUser.locale.abbr;
    console.log('Locale: ' + this.locale);
  }

  async getDeviceTypes() {
    this.deviceTypes = (await (this.lookupService.getDeviceTypes())) as DeviceType[];
  }

  async getBinTypes() {
    this.binTypes = (await (this.lookupService.getBinTypes())) as BinType[];
  }

  async getContentTypes() {
    this.contentTypes = (await (this.lookupService.getContentTypes())) as ContentType[];
  }

  async getOwners() {
    this.userService.getUsers()
      .subscribe(users => {
        console.log('Back from getUsers API: ');

        this.owners = clone(users);
      });      
  }

  public compareById(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  public compareByName(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.name === obj2.name : obj1 === obj2;
  }

	async getUnit(id) {
    if (id > 0) {
      this.unitService.getUnit(id)
        .subscribe(unit => {
          console.log('Back from getUnit API: ' + id);
          console.log({ unit });

          let tempUnit: Unit = clone(unit);
          tempUnit = this.setUnitValues(tempUnit);

          this.unit = tempUnit;
          this.displayWaitingDialog = false;
        });      
    } else {
      this.unit = new Unit();
      this.unit.id = 0;
      
      this.displayWaitingDialog = false;
    }
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

  setUnitValues(unit: Unit): Unit {
    console.log('setUnitValues - start');

    unit.deviceTypeSort = unit.deviceType.name;
    unit.binTypeSort = unit.binType.name;
    unit.contentTypeSort = unit.contentType.name;

    unit.insertDateStr = this.formatDate(unit.insertDate);
    unit.modifiedDateStr = this.formatDate(unit.modifiedDate);

    unit.lastActivityStr = this.formatDate(unit.lastActivity);

    if (unit.location == null) { unit.location = ''; }
    if (unit.latitude == null) { unit.latitude = 0; }
    if (unit.longitude == null) { unit.longitude = 0; }
    if (unit.emptyLevel == null) { unit.emptyLevel = 0; }

    console.log('setUnitValues - end');
    this.displayWaitingDialog = false;
    return unit;
  }

  validate() {
    if (this.unit.owner == null || this.unit.owner.id == null) {
      this.errorMsg = "Must select an owner";
      return false;
    }
    if (this.unit.serialNo == null || this.unit.serialNo == '') {
      this.errorMsg = "Must input Serial No.";
      return false;
    }
    if (this.unit.location == null || this.unit.location == '') {
      this.errorMsg = "Must input location";
      return false;
    }
    if (this.unit.latitude == null || this.unit.latitude == 0) {
      this.errorMsg = "Must input latitude";
      return false;
    }
    if (this.unit.longitude == null || this.unit.longitude == 0) {
      this.errorMsg = "Must input longitude";
      return false;
    }
    if (this.unit.deviceType.id == null || this.unit.deviceType.id == 0) {
      this.errorMsg = "Must select a Device Type";
      return false;
    }
    if (this.unit.binType.id == null || this.unit.binType.id == 0) {
      this.errorMsg = "Must select a Bin Type";
      return false;
    }
    if (this.unit.contentType.id == null || this.unit.contentType.id == 0) {
      this.errorMsg = "Must select a Content Type";
      return false;
    }
    if (!this.unit.useBinTypeLevel) {
      if (this.unit.emptyLevel == null || this.unit.emptyLevel == 0) {
        this.errorMsg = "Must input Empty Level";
        return false;
      }
    } else {
      this.unit.emptyLevel = 0;
    }

    return true;
  }

  onReadings() {
    console.log('onReadings: ' + this.unit.id);

    // this.router.navigate(['/unit', { id: unitId }]);
    this.router.navigateByUrl('unitReadings/' + this.unit.id);    
  }

  onSave() {
    console.log('onSave clicked');
    if (!this.validate()) {
      alert('Fix input before saving');
    } else {
      this.errorMsg = '';
      console.log(this.unit);
      this.displayWaitingDialog = true;
      this.unitService.saveUnit(this.unit)
        .subscribe(
          unit => {
            console.log('After save: ', unit);

            unit => unit;
            this.displayWaitingDialog = false;
            this.location.back();
          },
          err => {
            console.log('Save Error: ', err);
            this.errorMsg = 'Failed to save - ' + err;
          });
    }
  }


	onBack(): void {
    console.log('Clicked back');
    this.location.back();
  }  
    
}
