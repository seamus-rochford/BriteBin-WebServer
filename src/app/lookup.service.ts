import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private readonly lookupUrl = `${environment.apiUrl}/lookup`;

  constructor(private httpClient: HttpClient) { }


  // GET binTypes
  getBinTypes() {
    const url = `${this.lookupUrl}/getBinTypes`;
    console.log('Get binTypes Url: ' + url);
    return this.httpClient.get(url).toPromise();
  }


  // GET binContentTypes
  getContentTypes() {
    const url = `${this.lookupUrl}/getContentTypes`;
    console.log('Get contentTypes Url: ' + url);
    return this.httpClient.get(url).toPromise();
  }


  // GET getCountries
  getCountries() {
    const url = `${this.lookupUrl}/getCountries`;
    console.log('Get getCountries Url: ' + url);
    return this.httpClient.get(url).toPromise();
  }


  // GET deviceTypes
  getDeviceTypes() {
    const url = `${this.lookupUrl}/getDeviceTypes`;
    console.log('Get deviceTypes Url: ' + url);
    return this.httpClient.get(url).toPromise();
  }


  // GET getLocales
  getLocales() {
    const url = `${this.lookupUrl}/getLocales`;
    console.log('Get getLocales Url: ' + url);
    return this.httpClient.get(url).toPromise();
  }


  // GET getRoles
  getRoles() {
    const url = `${this.lookupUrl}/getRoles`;
    console.log('Get getRoles Url: ' + url);
    return this.httpClient.get(url).toPromise();
  }


  // GET getStatus
  getStatus() {
    const url = `${this.lookupUrl}/getStatus`;
    console.log('Get getStatus Url: ' + url);
    return this.httpClient.get(url).toPromise();
  }


}
