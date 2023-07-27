import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceRaiserFormComponent } from './components/grievance-raiser-form/grievance-raiser-form.component';
import { GrievanceManagementComponent } from './components/grievance-management/grievance-management.component';

const routes: Routes = [
  // {
  //   path: '', component:GrievanceRaiserFormComponent, pathMatch: 'full',
  // },
  {
    path:'management', component: GrievanceManagementComponent,
  },
  
   
    
  
  {
    path: 'login', loadChildren :()=> import('../auth-modules/auth-modules.module').then(m=>m.AuthModulesModule)
  },
  {
    path: 'manage-tickets', component:GrievanceManagementComponent, pathMatch: 'full',
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceModulesRoutingModule { }
