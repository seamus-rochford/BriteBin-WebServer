import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { UnitService } from 'src/app/unit.service';
import { AuthService } from 'src/app/auth.service';

import { Reading } from 'src/app/model/reading';
import { ReadingsSearch } from 'src/app/model/readings_search';
import { Locale } from '../model/locale';

declare var $: any; // jQuery

const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [DatePipe]
})

export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  map: google.maps.Map;

  mapBounds: google.maps.LatLngBounds;

  // Locale of logged in user
  locale: Locale;

  readingsSearchStr: '';
  readingsSearch: ReadingsSearch;

  allReadings: Reading[];   // stores all readings
  readings: Reading[];      // stores all readings filtered by screen filters


  constructor(
    private unitService: UnitService,
    private authService: AuthService,
    public router: Router    

  ) { }

  ngOnInit(): void {
    console.log('Map - Init - start'); 
  
    this.locale = this.authService.getLocale();

    this.getLatestReadings();

    this.readingsSearch = new ReadingsSearch();
    this.readingsSearch.searchStr = [];      
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
    console.log('loadAllMarkers');
    readings.forEach( reading => {

      console.log('Location: ' + reading.unit.location);
      // Create marker
      const marker = new google.maps.Marker({
          position: new google.maps.LatLng(reading.unit.latitude, reading.unit.longitude),
          map: this.map,
          title: reading.unit.location + " - " + reading.binLevel + '\n(' + reading.unit.latitude + ', ' + reading.unit.longitude + ')'
      });

      // Create Info window
      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });

      // Add click event to marker
      marker.addListener("click", () => {
        infoWindow.open(marker.getMap(), marker);
      });

      // Add marker to map
      marker.setMap(this.map);
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

  ngAfterViewInit() {
    // this.mapInitializer();
  }

}
