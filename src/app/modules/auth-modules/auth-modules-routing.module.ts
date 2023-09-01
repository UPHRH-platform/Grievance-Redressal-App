import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password/reset-password.component';

const routes: Routes = [
  {
    path:'', component:LoginPageComponent, pathMatch:'full'
  }, {
    path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthModulesRoutingModule { }
