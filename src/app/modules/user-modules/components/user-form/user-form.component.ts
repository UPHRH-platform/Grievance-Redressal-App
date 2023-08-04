import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup
  isUsertable:boolean = true;
  optionList:any[]=['Active', 'Inactive']
  roleList:any[]=['Nodal Officer','Secreatory', 'Admin']
  editDataObject:any;
  isEditUser:boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'User List', url: '/user-manage' },
    { label: 'User Details', url: '/user-manage/userform' },
  ];


  constructor(private router: Router,
    private route: ActivatedRoute){
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
    this.route.queryParams.subscribe((data)=>{
      console.log('dddd',data)
      this.editDataObject = data;
      if(Object.keys(this.editDataObject).length){
        this.isEditUser = true;
        this.setUserFormData();
      }
    })

  }

  setUserFormData(){
    this.userForm.setValue({
      firstName:this.editDataObject?.fullName,
      lastName:this.editDataObject?.fullName,
      emailId: this.editDataObject?.email,
      phoneNumber:this.editDataObject?.phoneNumber,
      role:this.editDataObject?.role,
      activeStatus:this.editDataObject?.accountStatus
    })
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
    this.isUsertable = false;
  }
  navigateToHome(){
    this.router.navigate(['user-manage'])
  }

  onSubmit(){
    console.log(this.userForm.value)
  }

}
