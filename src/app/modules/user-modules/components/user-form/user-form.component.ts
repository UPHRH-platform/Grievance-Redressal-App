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
  grievanceTypes: any = [];
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'User List', url: '/user-manage' },
    { label: 'User Details', url: '/user-manage/userform' },
  ];
  userId: string;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrServiceService,
    private configService: ConfigService, 
    ){
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]),
      lastName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]),
      username: new FormControl('',[Validators.required, Validators.email]),
      phone:  new FormControl('', [Validators.required, Validators.pattern("^(0|91)?[6-9][0-9]{9}$")]),
      role: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      department: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.grievanceTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.grievanceTypes = this.grievanceTypes.filter((item: any) => item.name !== 'Others');
    this.loggedInUserData = this.authService.getUserData();
    this.userForm.patchValue({
      departmentName: null
    })
    //console.log(this.route);
    this.route.queryParams.subscribe((param)=>{
      //console.log(param['id']);
      this.userId = param['id'];
      //console.log(this.userId);
      if(this.userId !== undefined) {
        this.isEditUser = true;
        this.getUserDetails();
      }
      // this.userDetails = data;
      // if(Object.keys(this.userDetails).length){
      //   this.isEditUser = true;
      //   this.setUserFormData();
      // }
    })

  }

  getUserDetails() {
    this.userService.getUserDetails(this.userId).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        this.setUserFormData();
        localStorage.setItem('userDetails', JSON.stringify(res.responseData));
      }
    })
  }

  setUserFormData(){
    let firstName = '', lastName = '';
    //console.log(this.userDetails);
    if((this.userDetails.firstName && this.userDetails.firstName !== "") && (this.userDetails.lastName && this.userDetails.lastName !== "")) {
      firstName = this.userDetails.firstName,
      lastName = this.userDetails.lastName
    };
    this.getDepartmentId();
    this.userForm.patchValue({
      firstName: firstName,
      lastName: lastName,
      username: this.userDetails?.username,
      phone:this.userDetails?.attributes.phoneNumber[0],
      role:this.userDetails?.attributes.Role[0],
      status: this.userDetails?.enabled === true? 'Active' : 'Inactive',
      // department: this.userDetails?.attributes?.departmentName[0] ? this.userDetails?.attributes.departmentName[0] : null
    })
  }

  getDepartmentId() {
    this.grievanceTypes.map((obj:any) => {
      if(this.userDetails?.attributes?.departmentName[0]) {
      if(this.userDetails?.attributes?.departmentName[0].toLowerCase() == obj.name.toLowerCase()) {
        this.userForm.patchValue({
          department: obj.id
        })
      }
      }
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
    //console.log("user details",  this.userForm.value);
    if( this.isEditUser) {
      this.updateUser();
    } else {
      this.addUser();
    }
  }
  
  updateUser() {
    const {firstName, lastName, phone, role, status, username, department} = this.userForm.value;
    const {id } = this.userDetails;
    const requestObj = {
      id: this.userDetails.id,
      keycloakId: this.userDetails.keycloakId,
      firstName: firstName,
      lastName: lastName,
      email: username,
      enabled: status === 'Active'? true: false,
      emailVerified: true,
      credentials: [
        {
            "type": "password",
            "value": "ka09eF$299",
            "temporary": "false"
        }
    ],
    attributes: {
      module: "grievance",
      departmentName: department,
      phoneNumber: phone,
      role: role
  }
      // userName: id,
      // request: {
      //   firstName,
      //   lastName,
      //   enabled: status === 'Active'? true: false,
        
      //   attributes: {
      //     module: 'grievances',
      //     departmentName: this.userDetails.attributes.departmentName[0],
      //     phoneNumber: phone,
      //     Role: role
      // },
      // }
    }
    this.isProcessing = true;
    this.userService.updateUser(requestObj).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        this.toastrService.showToastr("User updated successfully!", 'Success', 'success', '');
        this.isProcessing = false;
        this.navigateToHome();
     },
     error: (err) => {
      // success response
      if(err.status === 200) {
        this.toastrService.showToastr("User updated successfully!", 'Success', 'success', '');
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

  addUser() {
    const {firstName, lastName, phone, role, status, username, department} = this.userForm.value;
    //console.log(this.userForm.value);
    const enabled = status === 'Active'? true : false;
    const requestObj = {
      firstName,
      lastName,
      email: username,
      username: username,
      enabled: enabled,
      emailVerified: true,
      credentials: [
        {
            type: "password",
            value: "ka09eF$299",
            temporary: "false"
        }
    ],
    attributes: {
      module: 'grievance',
      departmentName: role === 'NODALOFFICER' ? department: role === 'GRIEVANCEADMIN' || role === 'ADMIN' ? -1 : null,
      phoneNumber: phone,
      Role: role
  },
    }
    this.isProcessing= true;
    this.userService.createUser(requestObj).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        this.toastrService.showToastr("User created successfully!", 'Success', 'success', '');
        this.isProcessing= false;
        this.navigateToHome();
     },
     error: (err) => {
      if(err.status !== 200) {
      this.toastrService.showToastr('Something went wrong. Please try again', 'Error', 'error', '');
      }
      this.isProcessing= false;
       // Handle the error here in case of login failure
     }}
    );
  }

  getRoleChange(event: any) {
    //console.log(event.value);
    if(event.value === 'NODALOFFICER') {
      this.userForm.get('department')?.addValidators(Validators.required);
    }
  }

}
