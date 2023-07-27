import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup
  isUsertable:boolean = true;
  optionList:any[]=['Active', 'Inactive']

  constructor(private router: Router){
    this.userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    emailId: new FormControl('',[Validators.required, Validators.email]),
    phoneNumber:  new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    activeStatus: new FormControl('', Validators.required)
    })

  }

  ngOnInit(): void {
    
  }

  get firstName(){
    return this.userForm.get('firstName')
  }
  get lastName(){
    return this.userForm.get('lastName')
  }

  get emailId(){
    return this.userForm.get('emailId')
  }

  get phoneNumber(){
    return this.userForm.get('phoneNumber')
  }

  get role(){
    return this.userForm.get('role')
  }

  addUserFn(){
    this.isUsertable = false
  }
  navigateToHome(){
    this.router.navigate(['manageuser'])
  }

  onSubmit(){
    console.log(this.userForm.value)
  }

}
