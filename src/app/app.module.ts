import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthModulesModule } from './modules/auth-modules/auth-modules.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SharedModule } from './shared';
import { CoreModule } from './core/core.module';
import { GrievanceModulesModule } from './modules/grievance-modules/grievance-modules.module';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AuthModulesModule,
    SharedModule,
    ReactiveFormsModule,
    CoreModule,
    GrievanceModulesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
