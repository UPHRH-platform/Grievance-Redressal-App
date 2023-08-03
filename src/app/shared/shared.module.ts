import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import {MaterialModule} from '../../material/material.module';
import { SharedSkeletonLoadingComponent } from './components/shared-skeleton-loading/shared-skeleton-loading.component';
import { SharedDialogOverlayComponent } from './components/shared-dialog-overlay/shared-dialog-overlay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SharedTableComponent,
    SharedSkeletonLoadingComponent,
    SharedDialogOverlayComponent,
    ConfirmationPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports :
  [
    SharedTableComponent,
    HeaderComponent,
    SharedSkeletonLoadingComponent,
  ]
})
export class SharedModule { }