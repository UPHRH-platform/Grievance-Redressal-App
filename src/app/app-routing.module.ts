import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/grievance-modules/components/home-page/home-page.component';
import { AuthGuard } from './core/guards/auth-guard/auth.guard';
import { RoleContentGuard } from './core/guards/role-content-guard/role-content.guard';
import { Roles } from './shared/config/roles.config';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CommonLayoutComponent } from './shared/components/common-layout/common-layout.component';
import { GrievanceRaiserFormComponent } from './modules/grievance-modules/components/grievance-raiser-form/grievance-raiser-form.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '', loadChildren :()=> import('../app/modules/auth-modules/auth-modules.module').then(m=>m.AuthModulesModule)
  },
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: 'home', 
        component: HomePageComponent, 
        canActivate: [AuthGuard, RoleContentGuard],
        data: {
          allowedRoles: [Roles.GRIEVANCEADMIN, Roles.NODALOFFICER, Roles.SUPERADMIN, Roles.ADMIN],
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
          allowedRoles: [Roles.GRIEVANCEADMIN, Roles.NODALOFFICER, Roles.SUPERADMIN, Roles.ADMIN],
        },
      },
      {
        path: 'dashboard', 
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard, RoleContentGuard],
        data: {
          allowedRoles: [Roles.SUPERADMIN, Roles.ADMIN],
        },
      },
      {
        path: 'configuration', 
        loadChildren: () => import('./modules/configuration/configuration.module').then(m => m.ConfigurationModule),
        canActivate: [AuthGuard, RoleContentGuard],
        data: {
          allowedRoles: [Roles.ADMIN],
        },
      },
      {
        path: 'user-profile', 
        component: UserProfileComponent, 
        canActivate: [AuthGuard],
        // data: {
        //   allowedRoles: [Roles.ADMIN, Roles.GRIEVANCEADMIN, Roles.NODALOFFICER, Roles.SUPERADMIN],
        // },
        pathMatch: 'full',
      },
      {
        path: 'new-ticket',
        component: GrievanceRaiserFormComponent,
        pathMatch: 'full',
      },
      {
        path: 'feedback', loadChildren :()=> import('../app/modules/feedback/feedback.module').then(m=>m.FeedbackModule)
      },
      {
        path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: "**",
        redirectTo:"/"

      }

    ]
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
