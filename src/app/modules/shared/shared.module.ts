import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import {MaterialModule} from '../../../material/material.module';


@NgModule({
  declarations: [
    HeaderComponent,
    SharedTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports :
  [
    SharedTableComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
