import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';

import { UnitService } from 'src/app/unit.service';
import { AuthService } from 'src/app/auth.service';
import { dynamicSort, toggleSort } from 'src/app/shared/dynamic-sort';

import { Reading } from 'src/app/model/reading';
import { ReadingsSearch } from 'src/app/model/readings_search';
import { User } from 'src/app/model/user';
import { Locale } from 'src/app/model/locale';
import { Global } from 'src/app/model/global';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

declare var $: any; // jQuery

const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-latest-readings',
  templateUrl: './latest-readings.component.html',
  styleUrls: ['./latest-readings.component.css'],
  providers: [DatePipe]
})

export class LatestReadingsComponent implements OnInit {

  readingsSearchStr: '';
  readingsSearch: ReadingsSearch;

  // fontawesome icons
  faSearch = faSearch;
  faBin = faTrash;
  faBinAlt = faTrashAlt;
  faBack = faAngleLeft;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faList = faList;
  faFlag = faFlag;

  // Locale of logged in user
  locale: Locale;
  loggedInUser: User;

  allReadings: Reading[];   // stores all readings
  readings: Reading[];      // stores all readings filtered by screen filters

  sortOrderLocation = 0;
  sortOrderBinType = 0;
  sortOrderContentType = 0;
  sortOrderDeviceType = 0;
  sortOrderBinLevel = 0;
  sortOrderBinLevelBC = 0;
  sortOrderNoFlapOpenings = 0;
  sortOrderBatteryVoltage = 0;
  sortOrderTemperature = 0;
  sortOrderNoCompactions = 0;
  sortOrderMessageType = 0;
  sortOrderVoltageReading = 0;
  sortOrderSource = 0;
  sortOrderRssi = 0;
  sortOrderSrc = 0;
  sortOrderSnr = 0;
  sortOrderBer = 0;
  sortOrderRsrq = 0;
  sortOrderRsrp = 0;
  sortOrderReadingTime = 0;

  displaySystemColumns = false;

  displayWaitingDialog = true;
  
  constructor(
    private authService: AuthService,
    private unitService: UnitService,
    private location: Location,
    public router: Router,
    public global: Global
  ) { }

  ngOnInit(): void {
    console.log('Unit Readings List - Init - start');
  
    this.loggedInUser = this.authService.getUser();
    this.locale = this.authService.getLocale();

    this.getLatestReadings();
  
    $('#allCheckbox').change(function () {
      $('tbody tr td input[name="select-checkbox"]').prop('checked', $(this).prop('checked'));
    });

    this.readingsSearch = new ReadingsSearch();
    this.readingsSearch.searchStr = [];      

    if (this.loggedInUser.role.id == this.global.userRoles.ADMIN) {
      this.displaySystemColumns = true;
    }
  }

  getLatestReadings(): void {
    this.unitService.getLatestReadings().subscribe(
      readings => {
        console.log({ readings });

        let tempReadings: Reading[] = clone(readings);
        tempReadings = this.setReadingValues(tempReadings);

        this.allReadings = tempReadings;
        this.readings = tempReadings;
      }
    );
  }

  formatDate(date: Date) {
    // Checks if date is null or undefined (=== strict check for null only)
    if (date == null) {
      return null;
    }

    const pipe = new DatePipe(this.locale.abbr);
    const dateStr = pipe.transform(date, 'short');

    return dateStr;
  }

  setReadingValues(filteredProperties: Reading[]): Reading[] {
    console.log('setUnitValues - start');
    filteredProperties.forEach(reading => {
      console.log('Reading: ', { reading });

      reading.locationSort = reading.unit.location;
      reading.binTypeSort = reading.unit.binType.name;
      reading.contentTypeSort = reading.unit.contentType.name;
      reading.deviceTypeSort = reading.unit.deviceType.name;
      
      reading.readingDateTimeStr = this.formatDate(reading.readingDateTime);
    });

    console.log('setReadingValues - end');

    this.displayWaitingDialog = false;
    return filteredProperties;
  }

  private filter() {
    this.readings = [];

    const tempReadings = [];

    this.allReadings.forEach((readingObject: Reading, rowIndex: number) => {
      // console.log(readingObject);

      // If readingObject is null, undefined or empty - ignore
      if (readingObject != null && Object.keys(readingObject).length !== 0) {

        let includeReading = true;

        if (this.readingsSearch.searchStr.length > 0) {
          // Check Status, email, role, name, addr1, addr2, city, county, country, locale
          // against any part of the search string
          this.readingsSearch.searchStr.forEach((searchSubStr) => {
            includeReading = includeReading
              && ((readingObject.unit.location.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.unit.binType.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.unit.deviceType.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.unit.contentType.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.readingDateTimeStr.indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.binLevel.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.binLevelBC.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.noFlapOpenings.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.batteryVoltage.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.temperature.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.noCompactions.toString().indexOf(searchSubStr.toUpperCase()) !== -1)
              );
          });
        }

        // console.log('includeUnit: ' + includeUnit);
        if (includeReading) {
          tempReadings.push(readingObject);
        }
      }
    });

    this.readings = tempReadings;
  }

  public doSearch() {
    console.log('readingsSearchStr: ' + this.readingsSearchStr);
    this.readingsSearch.searchStr = this.readingsSearchStr.split(' ');
    this.filter();
  }

  public sortByLocation() {
    console.log('Sort By location');
    this.sortOrderLocation = toggleSort(this.sortOrderLocation);
    this.readings.sort(dynamicSort('locationSort', this.sortOrderLocation));
  }

  public sortByBinType() {
    console.log('Sort By binType');
    this.sortOrderBinType = toggleSort(this.sortOrderBinType);
    this.readings.sort(dynamicSort('binTypeSort', this.sortOrderBinType));
  }

  public sortByDeviceType() {
    console.log('Sort By deviceType');
    this.sortOrderDeviceType = toggleSort(this.sortOrderDeviceType);
    this.readings.sort(dynamicSort('deviceTypeSort', this.sortOrderDeviceType));
  }

  public sortByContentType() {
    console.log('Sort By contenetType');
    this.sortOrderContentType = toggleSort(this.sortOrderContentType);
    this.readings.sort(dynamicSort('contentTypeSort', this.sortOrderContentType));
  }

  public sortByBinLevel() {
    console.log('Sort By binLevel');
    this.sortOrderBinLevel = toggleSort(this.sortOrderBinLevel);
    this.readings.sort(dynamicSort('binLevelPercent', this.sortOrderBinLevel));
  }

  public sortByBinLevelBC() {
    console.log('Sort By binLevelBC');
    this.sortOrderBinLevelBC= toggleSort(this.sortOrderBinLevelBC);
    this.readings.sort(dynamicSort('binLevelBCPercent', this.sortOrderBinLevelBC));
  }

  public sortByNoFlapOpenings() {
    console.log('Sort By noFlapOpenings');
    this.sortOrderNoFlapOpenings = toggleSort(this.sortOrderNoFlapOpenings);
    this.readings.sort(dynamicSort('noFlapOpenings', this.sortOrderNoFlapOpenings));
  }

  public sortByBatteryVoltage() {
    console.log('Sort By batteryVoltage');
    this.sortOrderBatteryVoltage = toggleSort(this.sortOrderBatteryVoltage);
    this.readings.sort(dynamicSort('batteryVoltage', this.sortOrderBatteryVoltage));
  }

  public sortByTemperature() {
    console.log('Sort By Temperature');
    this.sortOrderTemperature = toggleSort(this.sortOrderTemperature);
    this.readings.sort(dynamicSort('temperature', this.sortOrderTemperature));
  }

  public sortByNoCompactions() {
    console.log('Sort By No Compactions');
    this.sortOrderNoCompactions = toggleSort(this.sortOrderNoCompactions);
    this.readings.sort(dynamicSort('noCompactions', this.sortOrderNoCompactions));
  }

  public sortByReadingTime() {
    console.log('Sort By ReadingTime');
    this.sortOrderReadingTime = toggleSort(this.sortOrderReadingTime);
    this.readings.sort(dynamicSort('readingDateTime', this.sortOrderReadingTime));
  }

  public sortByMsgType() {
    console.log('Sort By MsgType');
    this.sortOrderMessageType = toggleSort(this.sortOrderMessageType);
    this.readings.sort(dynamicSort('messageType', this.sortOrderMessageType));
  }

  public sortByVoltageReading() {
    console.log('Sort By sortByVoltageReading');
    this.sortOrderVoltageReading = toggleSort(this.sortOrderVoltageReading);
    this.readings.sort(dynamicSort('batteryVoltageReading', this.sortOrderVoltageReading));
  }

  public sortBySource() {
    console.log('Sort By batteryVoltage');
    this.sortOrderSource = toggleSort(this.sortOrderSource);
    this.readings.sort(dynamicSort('source', this.sortOrderSource));
  }

  public sortByRssi() {
    console.log('Sort By Rssi');
    this.sortOrderRssi = toggleSort(this.sortOrderRssi);
    this.readings.sort(dynamicSort('rssi', this.sortOrderRssi));
  }

  public sortBySrc() {
    console.log('Sort By Rssi');
    this.sortOrderSrc = toggleSort(this.sortOrderSrc);
    this.readings.sort(dynamicSort('src', this.sortOrderSrc));
  }

  public sortBySnr() {
    console.log('Sort By Rssi');
    this.sortOrderSnr = toggleSort(this.sortOrderSnr);
    this.readings.sort(dynamicSort('snr', this.sortOrderSnr));
  }

  public sortByBer() {
    console.log('Sort By Rssi');
    this.sortOrderBer = toggleSort(this.sortOrderBer);
    this.readings.sort(dynamicSort('ber', this.sortOrderBer));
  }

  public sortByRsrq() {
    console.log('Sort By Rssi');
    this.sortOrderRsrq = toggleSort(this.sortOrderRsrq);
    this.readings.sort(dynamicSort('rsrq', this.sortOrderRsrq));
  }

  public sortByRsrp() {
    console.log('Sort By Rssi');
    this.sortOrderRsrp = toggleSort(this.sortOrderRsrp);
    this.readings.sort(dynamicSort('rsrp', this.sortOrderRsrp));
  }

  public editUnit(unitId) {
    console.log('Edit unit: ' + unitId);

    const currUser = this.authService.getUser();
    if (currUser.role.id < 2) {
      // only allow admin and distributers to edit bins
      this.router.navigateByUrl('unit/' + unitId);
    } else {
      // Goto unit readings instead
      this.router.navigateByUrl('unitReadings/' + unitId);
    }
  }

  public unitReading(unitId) {
    console.log('Dislay unit readings: ' + unitId);

    this.router.navigateByUrl('unitReadings/' + unitId);
  }
    
}
