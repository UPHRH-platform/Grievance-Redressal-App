import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
loginForm: FormGroup;
otpForm:FormGroup;
isEnableOtpLogin:boolean = false;
isOtpForm:boolean = false;
  constructor(private router:Router){
    this.loginForm = new FormGroup({
      emailId: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('',Validators.required)

    })

    this.otpForm = new FormGroup({
      otp:new FormControl('', Validators.required)
    })
  }

  signInForm(){
    console.log(this.loginForm)
  }
  getOTP(){
    if(this.loginForm.value.emailId){
     this.isOtpForm = true
    }
    else{
      alert('please enter emailId')
    }
    console.log('getOtp',this.loginForm)
  }

  signInWithOtp(){
    this.isEnableOtpLogin = true
  }

  navigateBackToEmail(){
    this.isOtpForm = false;
  }

  navigateBackToLoginEmailPassword(){
    this.isEnableOtpLogin = false;
  }

  SubmitOTP(){
    console.log(this.otpForm)
  }

}
