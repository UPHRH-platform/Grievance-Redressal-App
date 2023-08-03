import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userForm: FormGroup
  isUsertable: boolean = true;
  optionList: any[] = ['Active', 'Inactive']
  roleList: any[] = ['Nodal Officer', 'Secreatory', 'Admin']
  editDataObject: any;
  isEditData:boolean = false;


  constructor(private router: Router,
    private route: ActivatedRoute) {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', Validators.required),
      // role: new FormControl('', Validators.required),
      // activeStatus: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {

  }

  setUserFormData() {
    this.userForm.setValue({
      firstName: this.editDataObject?.fullName,
      lastName: this.editDataObject?.fullName,
      emailId: this.editDataObject?.email,
      phoneNumber: this.editDataObject?.phoneNumber,
      role: this.editDataObject?.role,
      activeStatus: this.editDataObject?.accountStatus
    })
  }

  get firstName() {
    return this.userForm.get('firstName')
  }
  get lastName() {
    return this.userForm.get('lastName')
  }

  get emailId() {
    return this.userForm.get('emailId')
  }

  get phoneNumber() {
    return this.userForm.get('phoneNumber')
  }


  addUserFn() {
    this.isUsertable = false;
  }
  navigateToHome() {
    this.router.navigate(['home'])
  }

  onClickEdit(){
    this.isEditData = true;
  }

  onClickCancel(){
    this.isEditData = false;
  }

  onSubmit() {
    console.log(this.userForm.value)
  }


}
