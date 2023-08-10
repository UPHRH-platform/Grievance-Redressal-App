import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { UserFormComponent } from './components/user-form/user-form.component';

const routes: Routes = [
  {
    path:'', component:ManageUserComponent, pathMatch: 'full'
  },
  {
    path:'userform', component: UserFormComponent
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserModulesRoutingModule { }
