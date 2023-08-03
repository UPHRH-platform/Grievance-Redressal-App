import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserModulesRoutingModule } from './user-modules-routing.module';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManageUserComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,
    UserModulesRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class UserModulesModule { }
