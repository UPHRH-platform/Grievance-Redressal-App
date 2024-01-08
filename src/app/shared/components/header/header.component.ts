import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private readonly TOKEN_KEY = 'access_token';
  showProfileNavBar = false;
  private userData: any;
  private userName: any;
  welcomeText: any = '';
 constructor(private router: Router, private authService: AuthService, private configService: ConfigService){

 }

 ngOnInit() {
  const token = this.getToken();
  if(token) {
    this.showProfileNavBar = true;
    this.userData = this.authService.getUserData();
    //console.log(this.userData);
    this.generateUserName();
  }
 }

 generateUserName() {
  const Roles = this.configService.rolesConfig.ROLES;
    const firstName = this.userData?.userRepresentation?.firstName;
    const lastName = this.userData?.userRepresentation?.lastName;
    const role = Roles[this.userData?.userRepresentation?.attributes.Role[0]];
    this.welcomeText = `${firstName} ${lastName} (${role})`;
    this.userName = firstName?.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
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

 navigateToResetPasswordPage() {
  this.router.navigate(['/reset-password']);
 }

}
