import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrievanceModulesRoutingModule } from './grievance-modules-routing.module';

import { GrievanceRaiserFormComponent } from './components/grievance-raiser-form/grievance-raiser-form.component';
import { GrievanceManagementComponent } from './components/grievance-management/grievance-management.component';
import { SharedModule } from '../shared/shared.module';
import {ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material/material.module';
@NgModule({
  declarations: [
    GrievanceRaiserFormComponent,
    GrievanceManagementComponent,
  ],
  imports: [
    CommonModule,
    GrievanceModulesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
  ],

})
export class GrievanceModulesModule { }
