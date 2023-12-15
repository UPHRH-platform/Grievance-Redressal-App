import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { HeaderComponent } from './components/header/header.component';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import {MaterialModule} from '../../material/material.module';
import { SharedSkeletonLoadingComponent } from './components/shared-skeleton-loading/shared-skeleton-loading.component';
import { SharedDialogOverlayComponent } from './components/shared-dialog-overlay/shared-dialog-overlay.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { CommonLayoutComponent } from './components/common-layout/common-layout.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ConfigService } from './services/config/config.service';
import { CommonFilterComponent } from './components/common-filter/common-filter.component';
import { SharedDescriptionDialogComponent } from './components/shared-description-dialog/shared-description-dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SharedTableComponent,
    SharedSkeletonLoadingComponent,
    SharedDialogOverlayComponent,
    ConfirmationPopupComponent,
    CommonLayoutComponent,
    BreadcrumbComponent,
    CommonFilterComponent,
    SharedDescriptionDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
  exports :
  [
    SharedTableComponent,
    HeaderComponent,
    SharedSkeletonLoadingComponent,
    BreadcrumbComponent,
    CommonFilterComponent
  ],
  providers: [ConfigService]
})
export class SharedModule { }