import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { KeyValue } from './model/key_value';


@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  private readonly systemUrl = `${environment.apiUrl}/system`;

  constructor(private httpClient: HttpClient) { }


  // GET config value (by key)
  getConfig(key: string) {
    const url = `${this.systemUrl}/getSysConfigValue?name=` + key;
    console.log('getConfig Url: ' + url);
    return this.httpClient.get(url);
  }  


  // POST save config KeyValue
  save(kv: KeyValue) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const url = this.systemUrl + '/saveSysConfigValue';
    console.log('Save Url: ' + url);

    return this.httpClient.post(url, kv, httpOptions);
  }  
}
