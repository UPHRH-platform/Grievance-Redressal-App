import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceRaiserFormComponent } from './components/grievance-raiser-form/grievance-raiser-form.component';
import { GrievanceManagementComponent } from './components/grievance-management/grievance-management.component';
import { ManageUserComponent } from '../user-modules/components/manage-user/manage-user.component';
import { UserFormComponent } from '../user-modules/components/user-form/user-form.component';

const routes: Routes = [
  // {
  //   path: '', component:GrievanceRaiserFormComponent, pathMatch: 'full',
  // },
  {
    path:'management', component: GrievanceManagementComponent,
  },
  
   {
        path:'manageuser',component:ManageUserComponent
   },
   {
    path:'userform', component: UserFormComponent
   },
    
  
  {
    path: 'login', loadChildren :()=> import('../auth-modules/auth-modules.module').then(m=>m.AuthModulesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceModulesRoutingModule { }
