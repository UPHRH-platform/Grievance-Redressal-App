import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HttpService, AuthService } from './services';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports :
  [
  ],
  providers: [HttpService, AuthService]
})
export class CoreModule { }

