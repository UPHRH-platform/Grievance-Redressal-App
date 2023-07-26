import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/grievance/manage-tickets', pathMatch: 'full' },
  {
    path: 'grievance', loadChildren :()=> import('./modules/grievance-modules/grievance-modules.module').then(m=>m.GrievanceModulesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
