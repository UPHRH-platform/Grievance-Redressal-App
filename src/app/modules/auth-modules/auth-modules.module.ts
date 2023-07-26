import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthModulesRoutingModule } from './auth-modules-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';


@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    AuthModulesRoutingModule
  ]
})
export class AuthModulesModule { }
