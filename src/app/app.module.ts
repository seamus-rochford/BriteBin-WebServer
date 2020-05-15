import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UsersComponent } from './users/users/users.component';
import { UserComponent } from './users/user/user.component';
import { ResetPwdComponent } from './users/reset-pwd/reset-pwd.component';
import { UnitsComponent } from './units/units/units.component';
import { UnitComponent } from './units/unit/unit.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { registerLocaleData } from '@angular/common';
import localeIE from '@angular/common/locales/en-IE';
import localeHR from '@angular/common/locales/hr';
import { MaterialModule } from './material/material.module';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UnitReadingsComponent } from './units/unit-readings/unit-readings.component';
import { LatestReadingsComponent } from './latest-readings/latest-readings.component';
import { MapComponent } from './map/map.component';
import { ConfigComponent } from './config/config.component';
import { BulkCreateUnitsComponent } from './units/bulk-create-units/bulk-create-units.component';
import { AlertsComponent } from './alerts/alerts.component';

registerLocaleData(localeIE, 'en-IE');
registerLocaleData(localeHR, 'hr-HR');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    UsersComponent,
    UserComponent,
    ResetPwdComponent,
    UnitsComponent,
    UnitComponent,
    ConfirmationDialogComponent,
    UnitReadingsComponent,
    LatestReadingsComponent,
    MapComponent,
    ConfigComponent,
    BulkCreateUnitsComponent,
    AlertsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    DialogsModule,
    DateInputsModule,
    ButtonsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'en-IE'},
    { provide: LOCALE_ID, useValue: 'hr-HR'},
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
