import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceRaiserFormComponent } from './components/grievance-raiser-form/grievance-raiser-form.component';
import { GrievanceManagementComponent } from './components/grievance-management/grievance-management.component';
import { GrievanceDetailsComponent } from './components/grievance-details/grievance-details.component';


const routes: Routes = [ 
  {
    path: 'manage-tickets', component:GrievanceManagementComponent, pathMatch: 'full',
  },
  {
    path: 'new-ticket', component:GrievanceRaiserFormComponent, pathMatch: 'full',
  },
  {
    path: ':id', component:GrievanceDetailsComponent, pathMatch: 'full',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceModulesRoutingModule { }
