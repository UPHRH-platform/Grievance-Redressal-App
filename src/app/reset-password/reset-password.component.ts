import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth-service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../modules/user-modules/services/user.service';
import { ToastrServiceService } from '../shared/services/toastr/toastr.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  userDetails: any = [];
  isProcessing = false;
  constructor(private authService: AuthService, private router:Router, private userService: UserService, private toastrService: ToastrServiceService) {

  }

  ngOnInit() {
    this.createForm();
    this.getUserDetails();
  }

  createForm() {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('',Validators.required)
    })
  }

  getUserDetails() {
    this.userDetails = [];
    const userId = this.authService.getUserData().userRepresentation.id;
    this.userService.getUserDetails(userId).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
      }
    });
  }

  resetPassword() {
    if(this.resetPasswordForm.valid) {
    this.updateUser();
    }
  }

  updateUser() {
    const requestObj = {
      id: this.userDetails?.id,
      keycloakId: this.userDetails?.keycloakId,
      firstName: this.userDetails?.firstName,
      lastName: this.userDetails?.lastName,
      email: this.userDetails?.username,
      enabled: this.userDetails?.enabled,
      emailVerified: true,
      credentials: [
        {
            "type": "password",
            "value": this.resetPasswordForm.value.confirmPassword,
            "temporary": "false"
        }
    ],
    attributes: {
      module: "grievance",
      departmentName: this.userDetails?.attributes.departmentName[0],
      phoneNumber: this.userDetails?.attributes.phoneNumber[0],
      role: this.userDetails?.attributes.Role[0]
  }
    }
    this.isProcessing = true;
    this.userService.updateUser(requestObj).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        this.toastrService.showToastr("Password changed uccessfully!", 'Success', 'success', '');
        this.isProcessing = false;
        this.navigateToHome();
     },
     error: (err) => {
      // success response
      if(err.status === 200) {
        this.toastrService.showToastr("Password changed successfully!", 'Success', 'success', '');
        this.isProcessing = false;
        this.getUserDetails();
        this.navigateToHome();
      }
      else {
        this.isProcessing = false;
        this.toastrService.showToastr('Something went wrong. Please try again', 'Error', 'error', '');
      }
      
       // Handle the error here in case of login failure
     }}
    );
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
