import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core';
import { ConfigService } from '../../services/config/config.service';
import { UserService } from 'src/app/modules/user-modules/services/user.service';
import { ToastrServiceService } from '../../services/toastr/toastr.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private readonly TOKEN_KEY = 'access_token';
  showProfileNavBar = false;
  private userData: any;
  public userName: any;
  welcomeText: any = '';
  role: string = '';
 constructor(
  private router: Router, 
  private authService: AuthService, 
  private configService: ConfigService,
  private userService: UserService,
  private toastrService: ToastrServiceService,
  ){

 }

 ngOnInit() {
  const token = this.getToken();
  if(token) {
    this.showProfileNavBar = true;
    this.userData = this.authService.getUserData();
    //console.log(this.userData);
    this.generateUserName();
    this.subscribeUserUpdate();
  }
 }

 subscribeUserUpdate() {
  this.userService.isUserDetailsUpdated.subscribe((event) => {
    if(event) {
      this.generateUserName();
    }
  })
 }

 generateUserName() {
  const userData = localStorage.getItem(this.authService.USER_DETAILS);
  const userDetails = userData ? JSON.parse(userData) : this.userData?.userRepresentation;
  const Roles = this.configService.rolesConfig.ROLES;
    const firstName =  userDetails?.firstName;
    const lastName = userDetails?.lastName;
    const role = Roles[this.userData?.userRepresentation?.attributes.Role[0]];
    this.welcomeText = `${firstName} ${lastName}`;
    this.role = role;
    this.userName = firstName?.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
 }
 getToken(): string | null {
  return localStorage.getItem(this.TOKEN_KEY);
}

 navigateToProfilePage(){
  this.router.navigate(['/user-profile']);
 }

 logout(){
  this.authService.logout().subscribe({
    next: (res) => {
      this.authService.clearLocalStorage();
      this.router.navigate(['/']);
    },
    error: (error) => {
      this.toastrService.showToastr(error.error.error, 'Error', 'error', '');
      this.authService.clearLocalStorage();
      this.router.navigate(['/']);
    }
  })
 }

 navigateToResetPasswordPage() {
  this.router.navigate(['/reset-password']);
 }

}
