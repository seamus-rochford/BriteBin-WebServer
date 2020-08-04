import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Unit } from './model/unit';

@Injectable({
  providedIn: 'root'
})

export class UnitService {

  private readonly unitUrl = `${environment.apiUrl}/unit`;

  constructor(private httpClient: HttpClient) { }

  // GET units
  getUnits() {
    const url = `${this.unitUrl}/getUnits`;
    console.log('GetUnits Url: ' + url);

    return this.httpClient.get(url);
  }

  // GET unit (by unitId)
  getUnit(unitId: number) {
    const url = `${this.unitUrl}/getUnit?unitId=` + unitId;
    console.log('GetUnit Url: ' + url);
    return this.httpClient.get(url);
  }


  // GET unit (by email)
  getUnitBySerialNo(serialNo: string) {
    const url = `${this.unitUrl}/getUnit?serialNo=` + serialNo;
    console.log('GetUnit Url: ' + url);
    return this.httpClient.get(url);
  }

  // POST save user
  saveUnit(unit: Unit) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const url = this.unitUrl + '/save';
    console.log('Save Url: ' + url);

    return this.httpClient.post(url, unit, httpOptions);
  }

  // GET units readings
  getUnitReadings(unitId: number) {
    const url = `${this.unitUrl}/getUnitReadings?unitId=` + unitId;
    console.log('getUnitReadings Url: ' + url);

    return this.httpClient.get(url);
  }

  // GET units readings
  getUnitReadingsLimit(unitId: number, limit: number) {
    const url = `${this.unitUrl}/getUnitReadings?unitId=${unitId}&limit=${limit}`;
    console.log('getUnitReadings Url: ' + url);

    return this.httpClient.get(url);
  }

  // GET latest Readings
  getLatestReadings() {
    const url = `${this.unitUrl}/getLatestReadings`;
    console.log('getLatestReadings Url: ' + url);

    return this.httpClient.get(url);
  }

  // GET pull readings
  pullReadings(unitId: number, serialNo: string) {
    const url = `${this.unitUrl}/pullReadings?unitId=` + unitId + '&serialNo=' + serialNo;
    console.log('pullReadings Url: ' + url);

    return this.httpClient.get(url);
  }

}
