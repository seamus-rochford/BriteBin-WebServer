import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';

import { UnitService } from 'src/app/unit.service';
import { LookupService } from 'src/app/lookup.service';
import { AuthService } from 'src/app/auth.service';
import { dynamicSort, toggleSort } from 'src/app/shared/dynamic-sort';

import { User } from 'src/app/model/user';
import { Unit } from 'src/app/model/unit';
import { UnitSearch } from 'src/app/model/unit_search';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


import { MatDialog } from '@angular/material/dialog';
import { BinType } from 'src/app/model/bin_type';
import { ContentType } from 'src/app/model/content_type';
import { DeviceType } from 'src/app/model/device_type';

declare var $: any; // jQuery

const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
  providers: [DatePipe]
})

export class UnitsComponent implements OnInit {

  unitSearchStr: '';
  unitSearch: UnitSearch;

  // fontawesome icons
  faSearch = faSearch;
  faBin = faTrash;
  faBack = faAngleLeft;
  faUserPlus = faUserPlus;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;

  locale: string;
  loggedInUser: User;

  allUnits: Unit[];   // stores all units
  units: Unit[];      // stores all units filtered by screen filters

  sortOrderSerialNo = 0;
  sortOrderDeviceType = 0;
  sortOrderLocation = 0;
  sortOrderLatitude = 0;
  sortOrderLongitude = 0;
  sortOrderBinType = 0;
  sortOrderContentType = 0;
  sortOrderUseBinTypeLevel = 0;
  sortOrderEmptyLevel = 0;
  sortOrderFullLevel = 0;
  sortOrderLastActivity = 0;
  sortOrderCreated = 0;

  binTypes: BinType[];
  contentTypes: ContentType[];
  deviceTypes: DeviceType[];

  displayWaitingDialog = true;

  constructor(
    private authService: AuthService,
    private unitService: UnitService,
    private lookupService: LookupService,
    private location: Location,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    console.log('Unit List - Init - start');

    // $(document).ready(() => {
    //   modals();
    // });

    this.getDeviceTypes();
    this.getBinTypes();
    this.getContentTypes();

    this.getUnits();

    this.loggedInUser = this.authService.getUser();
    this.locale = this.loggedInUser.locale.abbr;

    $('#allCheckbox').change(function () {
      $('tbody tr td input[type="checkbox"]').prop('checked', $(this).prop('checked'));
    });

    this.unitSearch = new UnitSearch();
    this.unitSearch.searchStr = [];    
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

  getUnits(): void {
    this.unitService.getUnits().subscribe(
      units => {
        console.log({ units });

        let tempUnits: Unit[] = clone(units);
        tempUnits = this.setUnitValues(tempUnits);

        this.allUnits = tempUnits;
        this.units = tempUnits;
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

  setUnitValues(filteredProperties: Unit[]): Unit[] {
    console.log('setUnitValues - start');
    filteredProperties.forEach(unit => {
      console.log('Unit: ', { unit });

      unit.deviceTypeSort = unit.deviceType.name;
      unit.binTypeSort = unit.binType.name;
      unit.contentTypeSort = unit.contentType.name;

      unit.insertDateStr = this.formatDate(unit.insertDate);
      unit.modifiedDateStr = this.formatDate(unit.modifiedDate);

      if (unit.useBinTypeLevel) {
        unit.emptyLevelSort = unit.binType.emptyLevel;
        unit.fullLevelSort = unit.binType.fullLevel;
      } else {
        unit.emptyLevelSort = unit.emptyLevel;
        unit.fullLevelSort = unit.fullLevel;
      }
      unit.lastActivityStr = this.formatDate(unit.lastActivity);

      if (unit.location == null) { unit.location = ''; }
      if (unit.latitude == null) { unit.latitude = 0; }
      if (unit.longitude == null) { unit.longitude = 0; }
      if (unit.emptyLevel == null) { unit.emptyLevel = 0; }
    });

    console.log('setUnitValues - end');
    this.displayWaitingDialog = false;
    return filteredProperties;
  }

  private filter() {
    this.units = [];

    const tempUnits = [];

    this.allUnits.forEach((unitObject: Unit, rowIndex: number) => {
      // console.log(unitObject);

      // If unitObject is null, undefined or empty - ignore
      if (unitObject != null && Object.keys(unitObject).length !== 0) {

        let includeUnit = true;

        if (this.unitSearch.searchStr.length > 0) {
          // Check Status, email, role, name, addr1, addr2, city, county, country, locale
          // against any part of the search string
          this.unitSearch.searchStr.forEach((searchSubStr) => {
            includeUnit = includeUnit
              && ((unitObject.serialNo.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (unitObject.deviceType.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (unitObject.location.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (unitObject.latitude.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (unitObject.longitude.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (unitObject.binType.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (unitObject.contentType.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (unitObject.emptyLevel.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
              );
          });
        }

        // console.log('includeUnit: ' + includeUnit);
        if (includeUnit) {
          tempUnits.push(unitObject);
        }
      }
    });

    this.units = tempUnits;
  }

  public doSearch() {
    console.log('unitSearchStr: ' + this.unitSearchStr);
    this.unitSearch.searchStr = this.unitSearchStr.split(' ');
    this.filter();
  }

  public sortBySerialNo() {
    console.log('Sort By SerialNo');
    this.sortOrderSerialNo = toggleSort(this.sortOrderSerialNo);
    this.units.sort(dynamicSort('serialNo', this.sortOrderSerialNo));
  }

  public sortByDeviceType() {
    console.log('Sort By deviceType');
    this.sortOrderDeviceType= toggleSort(this.sortOrderDeviceType);
    this.units.sort(dynamicSort('deviceTypeSort', this.sortOrderDeviceType));
  }

  public sortByLocation() {
    console.log('Sort By Location');
    this.sortOrderLocation = toggleSort(this.sortOrderLocation);
    this.units.sort(dynamicSort('location', this.sortOrderLocation));
  }

  public sortByLatitude() {
    console.log('Sort By Latitude');
    this.sortOrderLatitude = toggleSort(this.sortOrderLatitude);
    this.units.sort(dynamicSort('latitude', this.sortOrderLatitude));
  }

  public sortByLongitude() {
    console.log('Sort By Longitude');
    this.sortOrderLongitude = toggleSort(this.sortOrderLongitude);
    this.units.sort(dynamicSort('longitude', this.sortOrderLongitude));
  }

  public sortByBinType() {
    console.log('Sort By Bin Type');
    this.sortOrderBinType = toggleSort(this.sortOrderBinType);
    this.units.sort(dynamicSort('binTypeSort', this.sortOrderBinType));
  }

  public sortByContentType() {
    console.log('Sort By Content Type');
    this.sortOrderContentType = toggleSort(this.sortOrderContentType);
    this.units.sort(dynamicSort('contentTypeSort', this.sortOrderContentType));
  }

  public sortByEmptyLevel() {
    console.log('Sort By Empty Level');
    this.sortOrderEmptyLevel = toggleSort(this.sortOrderEmptyLevel);
    this.units.sort(dynamicSort('emptyLevelSort', this.sortOrderEmptyLevel));
  }

  public sortByFullLevel() {
    console.log('Sort By Full Level');
    this.sortOrderFullLevel = toggleSort(this.sortOrderFullLevel);
    this.units.sort(dynamicSort('fullLevelSort', this.sortOrderFullLevel));
  }

  public sortByLastActivity() {
    console.log('Sort By Last Activity Date');
    this.sortOrderLastActivity = toggleSort(this.sortOrderLastActivity);
    this.units.sort(dynamicSort('lastActivity', this.sortOrderLastActivity));
  }

  public sortByCreated() {
    console.log('Sort By Create Date');
    this.sortOrderCreated = toggleSort(this.sortOrderCreated);
    this.units.sort(dynamicSort('insertDate', this.sortOrderCreated));
  }

  
  public editUnit(unitId) {
    console.log('Edit unit: ' + unitId);

    // this.router.navigate(['/unit', { id: unitId }]);
    this.router.navigateByUrl('unit/' + unitId);
  }

  onBack() {
    console.log("Back Clicked");
    this.location.back();
  }

}
