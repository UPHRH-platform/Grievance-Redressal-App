import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/grievance-modules/components/home-page/home-page.component';

const routes: Routes = [
  {
    path: '', component:HomePageComponent, pathMatch: 'full',
  },
  {
    path:'user-manage', loadChildren:()=> import('../app/modules/user-modules/user-modules.module').then(m=>m.UserModulesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
