import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './modules/grievance-modules/components/home-page/home-page.component';
import { MaterialModule } from 'src/material/material.module';
import { AuthModulesModule } from './modules/auth-modules/auth-modules.module';




@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AuthModulesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
