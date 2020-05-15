import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './model/user';
import { Alert } from './model/alert';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  private readonly alertUrl = `${environment.apiUrl}/alert`;

  constructor(private httpClient: HttpClient) { }

  // GET Admin Alerts
  getAdminAlerts(customer: User) {
    const url = `${this.alertUrl}/getAdminAlerts?customerId=` + customer.id;
    console.log('getAdminAlerts Url: ' + url);

    return this.httpClient.get(url);
  }  

  // GET Distributor Alerts
  getDistributorAlerts(customer: User) {
    const url = `${this.alertUrl}/getDistributorAlerts?customerId=` + customer.id;
    console.log('getDistributorAlerts Url: ' + url);

    return this.httpClient.get(url);
  }  

  // GET Technician Alerts
  getTechnicianAlerts(customer: User) {
    const url = `${this.alertUrl}/getTechnicianAlerts?customerId=` + customer.id;
    console.log('getTechnicianAlerts Url: ' + url);

    return this.httpClient.get(url);
  }  

  // GET Corporate Alerts
  getCorporateAlerts(customer: User) {
    const url = `${this.alertUrl}/getCorporateAlerts?customerId=` + customer.id;
    console.log('getCorporateAlerts Url: ' + url);

    return this.httpClient.get(url);
  }  

  // GET Customer Alerts
  getCustomerAlerts(customer: User) {
    const url = `${this.alertUrl}/getCustomerAlerts?customerId=` + customer.id;
    console.log('getCustomerAlerts Url: ' + url);

    return this.httpClient.get(url);
  }  

  // GET Driver Alerts
  getDriverAlerts(customer: User) {
    const url = `${this.alertUrl}/getDriverAlerts?customerId=` + customer.id;
    console.log('getDriverAlerts Url: ' + url);

    return this.httpClient.get(url);
  }  

  // POST save alerts
  saveAlerts(alerts: Alert[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const url = this.alertUrl + '/saveAlerts';
    console.log('Save Url: ' + url);
    console.log(alerts);

    return this.httpClient.post(url, alerts, httpOptions);
  }
}
