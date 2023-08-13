import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './components/feedback/feedback.component'; 
import { FeedbackConfirmComponent } from './components/feedback-confirm/feedback-confirm.component'; 

const routes: Routes = [
  {
    path:'', component: FeedbackComponent, pathMatch: 'full'
  },
  {
    path:'confirm', component: FeedbackConfirmComponent, pathMatch: 'full'
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
