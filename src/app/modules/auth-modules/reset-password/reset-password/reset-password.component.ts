import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  constructor() {

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('',Validators.required)
    })
  }

  resetPassword() {
    console.log(this.resetPasswordForm.value);
  }
}
