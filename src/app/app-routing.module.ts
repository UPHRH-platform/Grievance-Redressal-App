import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/grievance-modules/components/home-page/home-page.component';
import { AuthGuard } from './core/guards/auth-guard/auth.guard';
import { RoleContentGuard } from './core/guards/role-content-guard/role-content.guard';
import { Roles } from './shared/config/roles.config';

const routes: Routes = [
  {
    path: '', loadChildren :()=> import('./modules/auth-modules/auth-modules.module').then(m=>m.AuthModulesModule)
  },
  {
    path: 'home', 
    component: HomePageComponent, 
    canActivate: [AuthGuard, RoleContentGuard],
    data: {
      allowedRoles: [Roles.ADMIN, Roles.GRIEVANCE_NODAL, Roles.NODAL_OFFICER, Roles.SECRETARY],
    },
    pathMatch: 'full',
  },
  {
    path:'user-manage', 
    loadChildren:()=> import('../app/modules/user-modules/user-modules.module').then(m=>m.UserModulesModule),
    canActivate: [AuthGuard, RoleContentGuard],
    data: {
      allowedRoles: [Roles.ADMIN],
    },
  },
  // { path: '', redirectTo: '/grievance/manage-tickets', pathMatch: 'full' },
  {
    path: 'grievance', 
    loadChildren :()=> import('./modules/grievance-modules/grievance-modules.module').then(m=>m.GrievanceModulesModule),
    canActivate: [AuthGuard, RoleContentGuard],
    data: {
      allowedRoles: [Roles.ADMIN, Roles.GRIEVANCE_NODAL, Roles.NODAL_OFFICER, Roles.SECRETARY],
    },
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
