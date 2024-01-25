import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth-service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../modules/user-modules/services/user.service';
import { ToastrServiceService } from '../shared/services/toastr/toastr.service';
import { ConfigService } from '../shared';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  userDetails: any = [];
  isProcessing = false;
  grievanceTypes: any = [];
  updating = false;
  constructor(
    private authService: AuthService, 
    private router:Router, 
    private userService: UserService, 
    private toastrService: ToastrServiceService, 
    private formBuilder: FormBuilder, 
    private configService: ConfigService,
    private dialog: MatDialog
    ) {

  }

  ngOnInit() {
    this.grievanceTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.createForm();
    this.getUserDetails();
  }

  createForm() {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^$@$!%*?&^#]*[$@$!%*?&^#]).{8,30}$/)
      ]),
      confirmPassword: new FormControl('',Validators.required)
    },
    {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
    });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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
        this.openConformationPopup();
    }
  }

  openConformationPopup() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: { 
        title: 'Your current session will be terminated by this operation.',
        processedBtnText: 'Proceed',
        cancelBtnText: 'Cancel'
      },
      maxWidth: '400vw',
      maxHeight: '100vh',
      height: '290px',
      width: '690px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(isConfirmed => {
      if (isConfirmed) {
        this.updateUser()
      }
    })
  }

  updateUser() {
    // let departmentId: any;
    // if (this.userDetails.attributes.role[0] !== 'SUPERADMIN' && this.userDetails.attributes.role[0] !== 'ADMIN') {
    //   this.grievanceTypes.map((obj: any) => {
    //     if (this.userDetails?.attributes?.departmentName[0].toLowerCase() === obj.name.toLowerCase()) {
    //       departmentId = obj.id;
    //     }
    //   })
    // }
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
      // departmentName: this.userDetails?.attributes?.departmentId,
      phoneNumber: this.userDetails?.attributes.phoneNumber,
      Role: this.userDetails?.attributes.role[0]
  }
    }
    this.isProcessing = true;
    this.updating = true;
    this.userService.updateUser(requestObj).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        this.toastrService.showToastr("Password changed uccessfully!", 'Success', 'success', '');
        this.isProcessing = false;
        this.logout();
        // this.navigateToHome();
     },
     error: (err) => {
      // success response
      if(err.status === 200) {
        this.toastrService.showToastr("Password changed successfully!", 'Success', 'success', '');
        this.isProcessing = false;
        this.logout();
        // this.getUserDetails();
        // this.navigateToHome();
      }
      else {
        this.updating = false;
        this.isProcessing = false;
        this.toastrService.showToastr('Something went wrong. Please try again', 'Error', 'error', '');
      }
      
       // Handle the error here in case of login failure
     }}
    );
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

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
