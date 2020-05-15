import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

import { KeyValue } from '../model/key_value';
import { User } from '../model/user';
import { AuthService } from '../auth.service';
import { ConfigService } from '../config.service';

const clone = obj => JSON.parse(JSON.stringify(obj));

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})


export class ConfigComponent implements OnInit {

  faCog = faCog;
  faClose = faTimes;
  faSave = faSave;
  faExclamation = faExclamation;

  mobileVersion: KeyValue;

  emailHost: KeyValue;
  emailusername: KeyValue;
  emailPassword: KeyValue;

  loggedInUser: User;
  locale: string;

  errorMsg = '';
  displayWaitingDialog = true;

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit(): void {
    console.log('unit.ngOnInt');

    const id = +this.route.snapshot.paramMap.get('id');
    console.log('UnitId: ' + id);

    this.getLoggedInInfo();

    this.getMobileVersion();
    
    // this.getEmailConfig();

    console.log('unit.ngOnInit - end');
  }

  async getLoggedInInfo() {
    this.loggedInUser = this.authService.getUser();
    console.log(this.loggedInUser);
    this.locale = this.loggedInUser.locale.abbr;
    console.log('Locale: ' + this.locale);
  }

  async getMobileVersion() {
    this.configService.getConfig('mobileVersion')
      .subscribe(kv => {
        console.log('Back from getConfig API: mobileVersion');
        console.log(kv);

        let tempKv: KeyValue = clone(kv);
        this.mobileVersion = tempKv;

        this.displayWaitingDialog = false;
      });      
  }  

  async getEmailConfig() {
    this.emailHost = (await (this.configService.getConfig('emailHost'))) as any;
    this.emailusername = (await (this.configService.getConfig('emailUsername'))) as any;
    this.emailPassword = (await (this.configService.getConfig('emailPassword'))) as any;
  }


  onSaveMobileVersion() {
    console.log('onSave clicked');
    if (this.mobileVersion.value === '') {
      alert('Mobile Version can not be blank');
    } else {
      this.errorMsg = '';
      console.log(this.mobileVersion);
      this.displayWaitingDialog = true;
      this.configService.save(this.mobileVersion)
        .subscribe(
          kv => {
            console.log('After save: ', kv);

            this.errorMsg = "Mobile Version saved to database";
            
            this.displayWaitingDialog = false;
            // this.location.back();
          },
          err => {
            this.displayWaitingDialog = false;
            console.log('Save Error: ', err);
            this.errorMsg = 'Failed to save - ' + err;
          });
    }
  }


	onBack(): void {
    console.log('Clicked back');
    this.location.back();
  }  
    

}
