import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserModulesRoutingModule } from './user-modules-routing.module';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { UserFormComponent } from './components/user-form/user-form.component';


@NgModule({
  declarations: [
    ManageUserComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,
    UserModulesRoutingModule
  ]
})
export class UserModulesModule { }
