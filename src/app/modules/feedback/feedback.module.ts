import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackRoutingModule } from './feedback-routing.module';
import {ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material/material.module';
import { StarRatingModule } from 'angular-star-rating';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackConfirmComponent } from './components/feedback-confirm/feedback-confirm.component';
import { FeedbackService } from './services/feedback.service';

@NgModule({
  declarations: [
    FeedbackComponent,
    FeedbackConfirmComponent
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    StarRatingModule.forRoot()
  ],
  providers: [FeedbackService]
})
export class FeedbackModule { }
