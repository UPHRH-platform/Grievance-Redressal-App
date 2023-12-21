import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth-service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../modules/user-modules/services/user.service';
import { ToastrServiceService } from '../shared/services/toastr/toastr.service';
import { ConfigService } from '../shared';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  userDetails: any = [];
  isProcessing = false;
  grievanceTypes: any = []
  constructor(private authService: AuthService, private router:Router, private userService: UserService, private toastrService: ToastrServiceService, private formBuilder: FormBuilder, private configService: ConfigService) {

  }

  ngOnInit() {
    this.grievanceTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.createForm();
    this.getUserDetails();
  }

  createForm() {
    this.resetPasswordForm = this.formBuilder.group({
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
    let departmentId: any;
    this.grievanceTypes.map((obj: any) => {
      if(this.userDetails.attributes.role[0] !== 'SUPERADMIN') {
      if(this.userDetails?.attributes.departmentName[0].toLowerCase() === obj.name.toLowerCase()) {
        departmentId = obj.id;   
      }
    }
    })
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
      departmentName: departmentId,
      phoneNumber: this.userDetails?.attributes.phoneNumber,
      Role: this.userDetails?.attributes.role[0]
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
