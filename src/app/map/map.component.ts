import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { UnitService } from 'src/app/unit.service';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { LookupService } from '../lookup.service';

import { Reading } from 'src/app/model/reading';
import { ReadingsSearch } from 'src/app/model/readings_search';
import { Locale } from '../model/locale';
import { User } from '../model/user';
import { DeviceType } from '../model/device_type';
import { BinType } from '../model/bin_type';
import { ContentType } from '../model/content_type';
import { BinLevel } from '../model/bin_level';
import { Global } from '../model/global';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { reduce } from 'rxjs/operators';

declare var $: any; // jQuery

const clone = obj => JSON.parse(JSON.stringify(obj));


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [DatePipe]
})

export class MapComponent implements OnInit {

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  map: google.maps.Map;
  mapBounds: google.maps.LatLngBounds;
  mapMarkers: google.maps.Marker[];

  faBin = faTrashAlt;

  // Locale of logged in user
  locale: Locale;

  mapSearchStr: '';
  mapSearch: ReadingsSearch;

  allReadings: Reading[];   // stores all readings
  readings: Reading[];      // stores all readings filtered by screen filters


  constructor(
    private unitService: UnitService,
    private authService: AuthService,
    private userService: UserService,
    private lookupService: LookupService,
    private global: Global,
    public router: Router    

  ) { }

  ngOnInit(): void {
    console.log('Map - Init - start'); 
  
    this.locale = this.authService.getLocale();

    this.mapSearch = new ReadingsSearch();
    this.mapSearch.searchStr = [];

    Promise.all([
      this.getOwners(),
      this.getDeviceTypes(),
      this.getBinTypes(),
      this.getBinLevels(),
      this.getContentTypes()
    ]).then(values => {
      this.getLatestReadings();

      this.defaultAllSelected(this.mapSearch.deviceTypes);
      this.defaultAllSelected(this.mapSearch.binTypes);
      this.defaultAllSelected(this.mapSearch.binLevels);
      this.defaultAllSelected(this.mapSearch.contentTypes);
      this.defaultAllSelected(this.mapSearch.owners);
    });    
  } 

  defaultAllSelected (objArray: any) {
    for (let i = 0; i < objArray.length; i++) {
      objArray[i].selected = true;
    }
  }

  async getDeviceTypes() {
    this.mapSearch.deviceTypes = (await (this.lookupService.getDeviceTypes())) as DeviceType[];
  }

  async getBinTypes() {
    this.mapSearch.binTypes = (await (this.lookupService.getBinTypes())) as BinType[];
  }

  async getBinLevels() {
    this.mapSearch.binLevels = (await (this.lookupService.getBinLevels())) as BinLevel[];
  }

  async getContentTypes() {
    this.mapSearch.contentTypes = (await (this.lookupService.getContentTypes())) as ContentType[];
  }

  async getOwners() {
    this.userService.getUsers()
      .subscribe(users => {
        console.log('Back from getUsers API: ');

        this.mapSearch.owners = clone(users);
      });      
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

      reading.readingDateTimeStr = this.formatDate(reading.readingDateTime);

    });

    console.log('setReadingValues - end');

    this.mapBounds = this.createBoundsForBinLocations(filteredProperties);
    console.log(this.mapBounds);
    // this.mapBounds = this.increaseBounds(this.mapBounds, 10);
    // console.log(this.mapBounds);

    this.mapInitializer(filteredProperties);

    // this.displayWaitingDialog = false;
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

        if (this.mapSearch.searchStr.length > 0) {
          // Check Status, email, role, name, addr1, addr2, city, county, country, locale
          // against any part of the search string
          this.mapSearch.searchStr.forEach((searchSubStr) => {
            includeReading = includeReading
              && ((readingObject.unit.location.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
                || (readingObject.unit.binType.name.toUpperCase().indexOf(searchSubStr.toUpperCase()) !== -1)
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

        for (let i = 0; i < this.mapSearch.contentTypes.length; i++) {
          if (readingObject.unit.contentType.id === this.mapSearch.contentTypes[i].id)
            includeReading = includeReading && this.mapSearch.contentTypes[i].selected;
        }

        for (let i = 0; i < this.mapSearch.binTypes.length; i++) {
          if (readingObject.unit.binType.id === this.mapSearch.binTypes[i].id)
            includeReading = includeReading && this.mapSearch.binTypes[i].selected;
        }

        for (let i = 0; i < this.mapSearch.deviceTypes.length; i++) {
          if (readingObject.unit.deviceType.id === this.mapSearch.deviceTypes[i].id)
            includeReading = includeReading && this.mapSearch.deviceTypes[i].selected;
        }

        for (let i = 0; i < this.mapSearch.owners.length; i++) {
          if (readingObject.unit.owner.id === this.mapSearch.owners[i].id)
            includeReading = includeReading && this.mapSearch.owners[i].selected;
        }

        for (let i = 0; i < this.mapSearch.binLevels.length; i++) {
          if (readingObject.binLevelStatus === this.mapSearch.binLevels[i].id)
            includeReading = includeReading && this.mapSearch.binLevels[i].selected;
        }

        // console.log('includeUnit: ' + includeUnit);
        if (includeReading) {
          tempReadings.push(readingObject);
        }
      }
    });

    this.readings = tempReadings;
  }

  getBoundsZoomLevel(bounds, mapDim) {
    let WORLD_DIM = { height: 256, width: 256 };
    let ZOOM_MAX = 15;  // Google allows maximum of 21 but 15 is enough

    function latRad(lat) {
        let sin = Math.sin(lat * Math.PI / 180);
        let radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  }

  createBoundsForBinLocations(readings) {
    let bounds = new google.maps.LatLngBounds();
    readings.forEach( reading => {
      let position = new google.maps.LatLng(reading.unit.latitude, reading.unit.longitude);
      bounds.extend(position);
    });
    return bounds;
  }  

  increaseBounds(bounds, percentage) {
    let pointNE = bounds.getNorthEast();
    let pointSW = bounds.getSouthWest();

    let latAdjustment = ((pointNE.lat() - pointSW.lat()) * percentage) / 100;
    let lngAdjustment = ((pointNE.lng() - pointSW.lng()) * percentage) / 100;
    
    var newPointNE = new google.maps.LatLng(pointNE.lat() + latAdjustment, pointNE.lng() + lngAdjustment);
    var newPointSW = new google.maps.LatLng(pointSW.lat() - latAdjustment, pointSW.lng() - lngAdjustment);
    
    bounds.extend(newPointNE);
    bounds.extend(newPointSW);

    return bounds;
  }

  loadAllMarkers(readings): void {
    // console.log('loadAllMarkers');
    this.mapMarkers = [];
    readings.forEach( (reading, index) => {

      console.log('DeviceType: ' + reading.unit.contentType.name);

      // icon color
      let binColor = '';
      if (reading.binLevelStatus === this.global.binStatus.BIN_EMPTY) {
        binColor = this.global.binColor.EMPTY
      } else if (reading.binLevelStatus === this.global.binStatus.BIN_FULL) {
        binColor = this.global.binColor.FULL;
      } else {
        binColor = this.global.binColor.IN_BETWEEN;
      }
      // Create marker
      const marker = new google.maps.Marker({
          position: new google.maps.LatLng(reading.unit.latitude, reading.unit.longitude),
          map: this.map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#AAA',
            fillOpacity: 0.2,
            strokeWeight: 0,
            scale: 12
          },          
          label: { 
            fontFamily: 'FontAwesome',
            text: '\uf1f8',
            color: binColor,
            fontSize: '24px',
            fontWeight: '400'
          },
          title: "Location: " + reading.unit.location + "\nBin Level: " + reading.binLevelPercent + " %\nContent: " + reading.unit.contentType.name
      });

      // Create Info window
      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });

      // Add click event to marker
      marker.addListener("click", () => {
        console.log('Unit id: ' + reading.unit.id);
        this.router.navigateByUrl('unit/' + reading.unit.id);
        // infoWindow.open(marker.getMap(), marker);
      });

      this.mapMarkers.push(marker);
      // Add marker to map
      this.mapMarkers[index].setMap(this.map);
    });
  }

  mapInitializer(readings) {

    console.log("mapInitialized");

    let $mapDiv = $('#map');
    let mapDim = {
        height: $mapDiv.height(),
        width: $mapDiv.width()
    }
    console.log(mapDim);

    let mapCenter = (this.mapBounds) ? this.mapBounds.getCenter() : new google.maps.LatLng(0, 0);
    let mapZoom = (this.mapBounds) ? this.getBoundsZoomLevel(this.mapBounds, mapDim) : 0;

    let mapOptions: google.maps.MapOptions = {
      center: mapCenter,
      zoom: mapZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  
    this.map = new google.maps.Map(
      this.gmap.nativeElement,
      mapOptions
    )

    //Adding bin markers
    this.loadAllMarkers(readings);
  }

  refreshMapMarkers() {

    // Clear the markers
    for (let i = 0; i < this.mapMarkers.length; i++) {
      this.mapMarkers[i].setMap(null);
    }

    this.loadAllMarkers(this.readings);
  }

  onFilterChange() {
    console.log('Content Type Changed');

    this.filter();
    this.refreshMapMarkers();
  }

}
