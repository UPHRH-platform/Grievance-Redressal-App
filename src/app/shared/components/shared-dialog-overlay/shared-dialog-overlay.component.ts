import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogData } from '../../../interfaces/interfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shared-dialog-overlay',
  templateUrl: './shared-dialog-overlay.component.html',
  styleUrls: ['./shared-dialog-overlay.component.css']
})
export class SharedDialogOverlayComponent {

  public grievanceRaiserOtpformGroup: FormGroup;

  otpSubitted: boolean = false;
  ticketId: Number = 345;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SharedDialogOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }


  ongrievanceRaiserotpformSubmit(value: any) {
    console.log(value)
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    this.grievanceRaiserOtpformGroup = this.formBuilder.group({
      mobileOTP: new FormControl('', [
        Validators.required,
        Validators.minLength(6), Validators.maxLength(6)]),
      emailOTP: new FormControl('', [
        Validators.required,
        Validators.minLength(6), Validators.maxLength(6)])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.grievanceRaiserOtpformGroup.valid) {
      this.submitOtp();
    }
  }

  submitOtp() {
    this.otpSubitted = true;
  }
}
