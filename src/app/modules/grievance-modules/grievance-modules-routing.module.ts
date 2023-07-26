import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrievanceRaiserFormComponent } from './components/grievance-raiser-form/grievance-raiser-form.component';

const routes: Routes = [
  {
    path: '', component:GrievanceRaiserFormComponent, pathMatch: 'full',
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
