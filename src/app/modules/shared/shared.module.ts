import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import {MaterialModule} from '../../../material/material.module';
import { SharedSkeletonLoadingComponent } from './components/shared-skeleton-loading/shared-skeleton-loading.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SharedTableComponent,
    SharedSkeletonLoadingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports :
  [
    SharedTableComponent,
    HeaderComponent,
    SharedSkeletonLoadingComponent
  ]
})
export class SharedModule { }
