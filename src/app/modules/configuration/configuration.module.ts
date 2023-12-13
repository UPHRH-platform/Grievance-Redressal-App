import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/material/material.module';


@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    ConfigurationRoutingModule
  ]
})
export class ConfigurationModule { }
