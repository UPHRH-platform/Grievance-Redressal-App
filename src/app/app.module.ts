import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GrievanceModulesModule } from './modules/grievance-modules/grievance-modules.module';
import { HomePageComponent } from './modules/grievance-modules/components/home-page/home-page.component';




@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GrievanceModulesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
