import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthModulesRoutingModule } from './auth-modules-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { MaterialModule } from 'src/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password/reset-password.component';


@NgModule({
  declarations: [
    LoginPageComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthModulesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,

  ]
})
export class AuthModulesModule { }
