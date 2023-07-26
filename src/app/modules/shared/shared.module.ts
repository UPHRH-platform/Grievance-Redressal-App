import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedTableComponent } from './components/shared-table/shared-table.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SharedTableComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
