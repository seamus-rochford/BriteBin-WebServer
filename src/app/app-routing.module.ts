import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users/users.component';
import { UserComponent } from './users/user/user.component';
import { ResetPwdComponent } from './users/reset-pwd/reset-pwd.component';
import { UnitsComponent } from './units/units/units.component';
import { BulkCreateUnitsComponent } from './units/bulk-create-units/bulk-create-units.component';
import { AlertsComponent } from './alerts/alerts.component';
import { UnitComponent } from './units/unit/unit.component';
import { UnitReadingsComponent } from './units/unit-readings/unit-readings.component';
import { LatestReadingsComponent } from './latest-readings/latest-readings.component';
import { MapComponent } from './map/map.component';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'default', component: LatestReadingsComponent, canActivate: [AuthGuard] },
  { path: 'resetPwd/:id', component: ResetPwdComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'units', component: UnitsComponent, canActivate: [AuthGuard] },
  { path: 'bulkCreateUnits', component: BulkCreateUnitsComponent, canActivate: [AuthGuard] },
  { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
  { path: 'unit/:id', component: UnitComponent, canActivate: [AuthGuard] },
  { path: 'unitReadings/:id', component: UnitReadingsComponent, canActivate: [AuthGuard] },
  { path: 'latestReadings', component: LatestReadingsComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'config', component: ConfigComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
