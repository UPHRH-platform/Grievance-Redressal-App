import { Injectable } from '@angular/core';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ToastrServiceService {
  options: GlobalConfig;
  toastRef:any = null;

  constructor(private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
    this.options.newestOnTop = true;
    this.options.progressBar = true;
    this.options.progressAnimation = 'decreasing';
   }

   showToastr(msg:any, title:string, type: string, option?:any) {
    if(this.toastRef){
      this.toastr.clear(this.toastRef);
      this.toastr.clear(this.toastRef.toastId);
      this.toastr.remove(this.toastRef);
      this.toastr.remove(this.toastRef.toastId);
    }
    if ( type === 'success') {
      this.toastr.success(msg, title, option);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title, option);
    } else if (type === 'error') {
      this.toastr.error(msg, title, option);
    } else {
      this.toastr.info(msg, title, option);
    }
   }
}

