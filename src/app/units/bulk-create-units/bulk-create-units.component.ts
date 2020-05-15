import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
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
import { faPlus } from '@fortawesome/free-solid-svg-icons';

declare var $: any; // jquery
const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-bulk-create-units',
  templateUrl: './bulk-create-units.component.html',
  styleUrls: ['./bulk-create-units.component.css']
})

export class BulkCreateUnitsComponent implements OnInit {

  faBin = faTrash;
  faClose = faTimes;
  faBack = faAngleLeft;
  faSave = faSave;
  faExclamation = faExclamation;
  faDelete = faTimes;
  faPlus = faPlus;

  owners: User[];
  deviceTypes: DeviceType[];
  binTypes: BinType[];
  contentTypes: ContentType[];

  loggedInUser: User;
  locale: string;

  unit: Unit;
  serialNo: string;
  serialNos: string[];
  serialNoMsg: string;

  errorMsg = '';
  displayWaitingDialog = false;
  
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

    this.displayWaitingDialog = true;

    Promise.all([
      this.getLoggedInInfo(),
      this.getDeviceTypes(),
      this.getBinTypes(),
      this.getContentTypes(),
      this.getOwners()
    ]).then( values => {
      this.displayWaitingDialog = false;
    });

    this.unit = new Unit();
    this.serialNos = [];
    this.serialNo = '';
    this.serialNoMsg = '';

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
    this.owners = (await (this.userService.getPossibleBinParents())) as User[];
  }
  
  public compareById(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }
  
  validate() {
    if (this.unit.owner == null || this.unit.owner.id == null) {
      this.errorMsg = "Must select an owner";
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
      if (this.unit.fullLevel == null || this.unit.fullLevel == 0) {
        this.errorMsg = "Must input Full Level";
        return false;
      }
    } else {
      this.unit.emptyLevel = 0;
      this.unit.fullLevel = 0;
    }
    if (this.serialNos == null || this.serialNos.length == 0) {
      this.errorMsg = "Must input at least 1 Serial No.";
      return false;
    }    

    return true;
  }

  enterKeyPressed(event) {
    this.addSerialNo();
  }

  clearMsg() {
    this.serialNoMsg = '';
  }

  addSerialNo() {
    // console.log('Add Serial No: ' + this.serialNo);

    // Check if serialNo already in list
    for (let i = 0; i < this.serialNos.length; i++) {
      if (this.serialNo.toUpperCase() == this.serialNos[i]) {
        this.serialNoMsg = 'This serialNo already input';
        return;
      }
    }
    this.serialNoMsg = '';

    if (this.serialNo != '') {
      this.serialNos.push(this.serialNo.toUpperCase());
      this.serialNo = '';
    }

    // console.log('SerialNos: ' + this.serialNos);
  }

  deleteSerialNo(serialNo) {
    // console.log('delete SerialNo.: ' + serialNo);
    // console.log('SerialNos Before: ' + this.serialNos);

    this.serialNoMsg = '';

    let foundIndex = -1;
    for (let i =0; i < this.serialNos.length; i++) {
      if (this.serialNos[i] === serialNo) {
        foundIndex = i;
      }
    }

    if (foundIndex > -1) {
      this.serialNos.splice(foundIndex--, 1);
    }
    // console.log('SerialNos After: ' + this.serialNos);
  }

  async doSave() {
    this.errorMsg = '';
    for(let i = 0; i < this.serialNos.length; i ++) {
      this.unit.serialNo = this.serialNos[i];
      this.unitService.saveUnit(this.unit)
        .subscribe(
          unit => {
            console.log('Unit saved');
          },
          err => {
            console.log('Save Error: ', err);
            this.errorMsg += 'Failed to save - serialNo: ' + err.error.serialNo + '    Error: ' + err.error.message + '\n';
          }); 
    }
  }

  async onSave() {
    console.log('onSave clicked');
    if (!this.validate()) {
      alert('Fix input before saving');
    } else {
      this.errorMsg = '';
      console.log(this.unit);
      this.displayWaitingDialog = true;

      await this.doSave();

      if (this.errorMsg == '') {
        this.unit = new Unit();
        this.serialNos = [];
        this.serialNo = '';

        this.errorMsg = 'All saved to database successfully';
      }
      this.displayWaitingDialog = false;
    }
  }


	onBack(): void {
    console.log('Clicked back');
    this.location.back();
  }  

}
