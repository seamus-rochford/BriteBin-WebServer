import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { User } from '../model/user';
import { Alert } from '../model/alert';
import { AlertService } from '../alert.service';
import { UserService } from '../user.service';

import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

declare var $: any; // jquery
const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  faBell = faBell;
  faBin = faTrashAlt;
  faFlag = faFlag;
  faClose = faTimes;
  faSave = faSave;
  faExclamation = faExclamation;
  faStar = faStar;
  faDamage = faPlusSquare;

  possibleBinParents: User[];
  customer: User;

  adminAlerts: Alert[];
  techAlerts: Alert[];
  distAlerts: Alert[];
  corpAlerts: Alert[];
  custAlerts: Alert[];
  driverAlerts: Alert[];

  errorMsg = '';
  displayWaitingDialog = false;

  constructor(
    private alertService: AlertService,
    private userService: UserService,
    private location: Location     
  ) { }

  ngOnInit(): void {

    $(document).on('click', 'table.adminAlert #allCheckbox', function() {
      $('tbody tr td input[name="userAdminCheckbox"]').prop('checked', $(this).prop('checked'));
    })

    $(document).on('click', 'table.distAlert #allCheckbox', function() {
      $('tbody tr td input[name="userDistCheckbox"]').prop('checked', $(this).prop('checked'));
    })

    $(document).on('click', 'table.techAlert #allCheckbox', function() {
      $('tbody tr td input[name="userTechCheckbox"]').prop('checked', $(this).prop('checked'));
    })

    $(document).on('click', 'table.driverAlert #allCheckbox', function() {
      $('tbody tr td input[name="userDriverCheckbox"]').prop('checked', $(this).prop('checked'));
    })

    $(document).on('click', 'table.corpAlert #allCheckbox', function() {
      $('tbody tr td input[name="userCorpCheckbox"]').prop('checked', $(this).prop('checked'));
    })

    $(document).on('click', 'table.custAlert #allCheckbox', function() {
      $('tbody tr td input[name="userCustCheckbox"]').prop('checked', $(this).prop('checked'));
    })

    // example of how to do checkbox for each alarm
    $(document).on('click', 'table.adminAlert #allBinFullCheckbox', function() {
      alert('Test');
      $('tbody tr td input[name="binFullCheckbox"]').prop('checked', $(this).prop('checked'));
    })

    this.getPossibleBinParents();
  }
  

  
  async getPossibleBinParents() {
    this.possibleBinParents = (await (this.userService.getPossibleBinParents())) as User[];
    console.log(this.possibleBinParents);

    if (this.possibleBinParents != null && this.possibleBinParents.length > 0) {
      this.customer = this.possibleBinParents[0];
      console.log(this.customer.name);

      this.refreshAlertLists();
    }
  }

  async refreshAlertLists() {
    console.log(this.customer.name);

    this.getAdminAlerts(this.customer);
    this.getDistributorAlerts(this.customer);
    this.getTechnicianAlerts(this.customer);
    this.getCorporateAlerts(this.customer);
    this.getCustomerAlerts(this.customer);
    this.getDriverAlerts(this.customer);
  }

  async getAdminAlerts(customer) {
    this.alertService.getAdminAlerts(customer).subscribe(
      alerts => {
        console.log(alerts);

        let tempAlerts: Alert[] = clone(alerts);

        this.adminAlerts = tempAlerts;
      }
    );
  }

  async getDistributorAlerts(customer) {
    this.alertService.getDistributorAlerts(customer).subscribe(
      alerts => {
        console.log(alerts);

        let tempAlerts: Alert[] = clone(alerts);

        this.distAlerts = tempAlerts;
      }
    );
  }

  async getTechnicianAlerts(customer) {
    this.alertService.getTechnicianAlerts(customer).subscribe(
      alerts => {
        console.log(alerts);

        let tempAlerts: Alert[] = clone(alerts);

        this.techAlerts = tempAlerts;
      }
    );
  }

  async getCorporateAlerts(customer) {
    this.alertService.getCorporateAlerts(customer).subscribe(
      alerts => {
        console.log(alerts);

        let tempAlerts: Alert[] = clone(alerts);

        this.corpAlerts = tempAlerts;
      }
    );
  }

  async getCustomerAlerts(customer) {
    this.alertService.getCustomerAlerts(customer).subscribe(
      alerts => {
        console.log(alerts);

        let tempAlerts: Alert[] = clone(alerts);

        this.custAlerts = tempAlerts;
      }
    );
  }

  async getDriverAlerts(customer) {
    this.alertService.getDriverAlerts(customer).subscribe(
      alerts => {
        console.log(alerts);

        let tempAlerts: Alert[] = clone(alerts);

        this.driverAlerts = tempAlerts;
      }
    );
  }

  public compareById(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  async onSave() {
    console.log('onSave clicked');
    this.displayWaitingDialog = true;

    this.errorMsg = '';

    let alerts: Alert[];

    console.log('Admin alerts: ' + JSON.stringify(this.adminAlerts));
    if (this.adminAlerts != null) {
      alerts = clone(this.adminAlerts);
    }
    console.log(alerts);

    console.log('Dist alerts: ' + JSON.stringify(this.distAlerts));
    if (this.distAlerts != null) {
      alerts = alerts.concat(this.distAlerts);
    }
    console.log(alerts);

    console.log('Tech alerts: ' + JSON.stringify(this.techAlerts));
    if (this.techAlerts != null) {
      alerts = alerts.concat(this.techAlerts);
    }
    console.log(alerts);

    console.log('Corp alerts: ' + JSON.stringify(this.corpAlerts));
    if (this.corpAlerts != null) {
      alerts = alerts.concat(this.corpAlerts);
    }
    console.log(alerts);

    console.log('Cust alerts: ' + JSON.stringify(this.custAlerts));
    if (this.custAlerts != null) {
      alerts = alerts.concat(this.custAlerts);
    }
    console.log(alerts);

    console.log('Driver alerts: ' + JSON.stringify(this.driverAlerts));
    if (this.driverAlerts != null) {
      alerts = alerts.concat(this.driverAlerts);
    }
    console.log(alerts);

    console.log('All Alerts:');
    console.log(alerts);

    this.alertService.saveAlerts(alerts)
      .subscribe(
        unit => {
          console.log('Alerts saved');
          this.displayWaitingDialog = false;
        },
        err => {
          console.log('Save Error: ', err);
          this.errorMsg += 'Failed to save - allerts: ' + err.error.message + '\n';
          this.displayWaitingDialog = false;
        }); 


  }


	onBack(): void {
    console.log('Clicked back');
    this.location.back();
  }  

}
