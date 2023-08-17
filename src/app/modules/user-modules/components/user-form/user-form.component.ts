import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem, ConfigService } from 'src/app/shared';
import { getRole, getAllRoles, getRoleObject } from 'src/app/shared';
import { AuthService } from 'src/app/core';
import { UserService } from '../../services/user.service';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup
  isUsertable: boolean = true;
  statusList:any[]=['Active', 'Inactive']
  roleList:any[]= getAllRoles();
  userDetails:any;
  isEditUser:boolean = false;
  loggedInUserData: any;
  isProcessing: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'User List', url: '/user-manage' },
    { label: 'User Details', url: '/user-manage/userform' },
  ];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrServiceService,
    private configService: ConfigService, 
    ){
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('',[Validators.required, Validators.email]),
      phone:  new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loggedInUserData = this.authService.getUserData();
    this.route.queryParams.subscribe((data)=>{
      this.userDetails = data;
      if(Object.keys(this.userDetails).length){
        this.isEditUser = true;
        this.setUserFormData();
      }
    })

  }

  setUserFormData(){
    this.userForm.setValue({
      firstName:this.userDetails?.name.split(" ")[0],
      lastName:this.userDetails?.name.split(" ")[1],
      username: this.userDetails?.username,
      phone:this.userDetails?.phone,
      role: this.userDetails?.role,
      status:this.userDetails?.isActive ? 'Active' : 'Inactive'
    })
  }

  get firstName(){
    return this.userForm.get('firstName')
  }
  get lastName(){
    return this.userForm.get('lastName')
  }

  get username(){
    return this.userForm.get('username')
  }

  get phone(){
    return this.userForm.get('phone')
  }

  get role(){
    return this.userForm.get('role')
  }

  navigateToHome(){
    this.router.navigate(['user-manage'])
  }

  getUserRole(roleName: string) {
   return getRole(roleName);
  }

  onSubmit(){
    console.log("user details",  this.userForm.value);
    if( this.isEditUser) {
      this.updateUser();
    } else {
      this.addUser();
    }
    console.log(this.userForm.value)
  }
  
  updateUser() {
    const {firstName, lastName, phone, role, status, username} = this.userForm.value;
    const {id } = this.userDetails;
    const userDetails = {
      name: `${firstName} ${lastName}`,
      username,
      phone,
      isActive: status == 'Active' ? true : false,
      roles: [getRoleObject(role)],
      id,
      updatedBy: this.loggedInUserData.userId,
    }
    this.isProcessing = true;
    this.userService.createOrUpdateUser(userDetails).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        this.toastrService.showToastr("User updated successfully!", 'Success', 'success', '');
        this.isProcessing= false;
     },
     error: (err) => {
      this.toastrService.showToastr(err, 'Error', 'error', '');
      this.isProcessing= false;
       // Handle the error here in case of login failure
     }}
    );
  }

  addUser() {
    const {firstName, lastName, email, phone, role, status, username} = this.userForm.value;
    const userDetails = {
      firstName,
      lastname: lastName,
      email: username,
      /* below two fields are not mandatory to be sent of backend */
      // emailVerified: true,
      //password: "",
      userName: `${firstName} ${lastName}`,

      phoneNumber: phone,
      channel: this.configService.urlConFig.URLS.USER_CREATE_CHANNEL,
      // isActive: status == 'Active' ? true : false,
      roles: [getRoleObject(role)],
      // orgId: 1
    }
    this.isProcessing= true;
    this.userService.createUser(userDetails).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        this.toastrService.showToastr("User add successfully!", 'Success', 'success', '');
        this.isProcessing= false;
     },
     error: (err) => {
      this.toastrService.showToastr(err, 'Error', 'error', '');
      this.isProcessing= false;
       // Handle the error here in case of login failure
     }}
    );
  }

}
