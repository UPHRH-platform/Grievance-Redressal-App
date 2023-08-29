import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private readonly TOKEN_KEY = 'access_token';
  showProfileNavBar = false;
 constructor(private router: Router, private authService: AuthService){

 }

 ngOnInit() {
  const token = this.getToken();
  if(token) {
    this.showProfileNavBar = true;
  }
 }

 getToken(): string | null {
  return localStorage.getItem(this.TOKEN_KEY);
}

 navigateToProfilePage(){
  this.router.navigate(['/user-profile']);
 }

 logout(){
  this.authService.logout();
  this.router.navigate(['/']);
 }

}
