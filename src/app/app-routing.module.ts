import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/grievance-modules/components/home-page/home-page.component';

const routes: Routes = [
  {
    path: '', loadChildren :()=> import('../app/modules/auth-modules/auth-modules.module').then(m=>m.AuthModulesModule)
  },
  {
    path: 'home', component:HomePageComponent, pathMatch: 'full',
  },
  {
    path:'user-manage', loadChildren:()=> import('../app/modules/user-modules/user-modules.module').then(m=>m.UserModulesModule)
  },
  // { path: '', redirectTo: '/grievance/manage-tickets', pathMatch: 'full' },
  {
    path: 'grievance', loadChildren :()=> import('./modules/grievance-modules/grievance-modules.module').then(m=>m.GrievanceModulesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
