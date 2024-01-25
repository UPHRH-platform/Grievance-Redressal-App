import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './core';
import { Router } from '@angular/router';
import { ToastrServiceService } from './shared/services/toastr/toastr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'grievance-app';

  constructor(private bnIdle: BnNgIdleService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrServiceService){
    this.bnIdle.startWatching(900).subscribe((res)=>{
      if(res){
        this.logout();
      }
    })

  }

  logout(){
    this.authService.logout().subscribe({
      next: (res) => {
        this.authService.clearLocalStorage();
        this.router.navigate(['/']);
        this.toastrService.showToastr("Session got expired", 'Error', 'error', '')
      },
      error: (error) => {
        this.toastrService.showToastr(error.error.error, 'Error', 'error', '');
        this.authService.clearLocalStorage();
        this.router.navigate(['/']);
        this.toastrService.showToastr("Session got expired", 'Error', 'error', '')
      }
    })
   }
}
