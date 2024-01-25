import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {  TableColumn, userTableData } from 'src/app/interfaces/interfaces';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { BreadcrumbItem, getAllRoles } from 'src/app/shared';
import { UserService } from '../../services/user.service';
import { getRole } from 'src/app/shared';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  isDataLoading:boolean = false;
  users: userTableData[] = [];
  usersTableColumns: TableColumn[] = [];
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'User Management', url: '/user-manage' },
  ];
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
  listLength: number = 0;
  searchForm:FormGroup;
  searchParams:string = '';
  private timeoutId: any;
  councilsList: any = [];
  departmentsList: any = [];
  noDepartments = false;
  councilId: any;
  departmentId: any;
  roleID: any;
  rolesList = getAllRoles();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private toastrService: ToastrServiceService,
    private datePipe: DatePipe,
    private sharedService: SharedService
  ){
    this.searchForm =  new FormGroup({
      searchData:  new FormControl('')
    })
  
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.initializeColumns();
    this.getCouncils();
  }

  applyFilter(searchterms:any){
    clearTimeout(this.timeoutId) 
     this.searchParams  = searchterms
      this.timeoutId= setTimeout(()=>{
      this.getUserByFilter()
     },1000
     ) 
   }
  navigateToHome(){
    this.router.navigate(['/home'])
  }
  goToUserDetail(userDetail?:any){
    //console.log(userDetail);
    if(userDetail){
      //console.log(userDetail);
      // const id = userDetail?.id;
      // keycloak id
      this.router.navigate(['/user-manage/userform'],{ queryParams: {id: userDetail.keycloakId}})
    }
    else {
      this.router.navigate(['/user-manage/userform'])
    }
  }
  
  toggleUserStatus(event:any) {
    const status = event.isActive ? 'deactivate' : 'activate';
   const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
    data: { title: `Are you sure you want to ${status} ?`},
    maxWidth:'400vw',
    maxHeight:'100vh',
    height:'30%',
    width:'30%',
    disableClose: true
   });
   let updatedUserData = {...event};
  //  const userIndex = this.users.findIndex(user => user.id === updatedUserData.id);
   dialogRef.afterClosed().subscribe(isConfirmed=>{
     if(isConfirmed) {
      updatedUserData.isActive = !event.isActive;
      const request = {
          id: event.id
      }
      this.isDataLoading = true;
      if(status == 'activate') {
        this.userService.activateUser(request).subscribe({
          next: (res) => {
            if (this.councilId) {
              this.getAllUsers();
            } else {
              this.getUserByFilter()
            }
          },
          error: (err) => {
            const errorMessage = err.error.error_message ? err.error.error_message : err.error.error;
            this.toastrService.showToastr(errorMessage, 'Error', 'error', '');
            if (this.councilId) {
              this.getAllUsers();
            } else {
              this.getUserByFilter()
            }
          }
        })
      }
      else {
        this.userService.deactivateUser(request).subscribe({
          next: (res) => {
            // this.users.splice(userIndex,1,updatedUserData);
            if (this.councilId) {
              this.getAllUsers();
            } else {
              this.getUserByFilter()
            }
         },
         error: (err) => { 
          const errorMessage = err.error.error_message ? err.error.error_message : err.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error', '');
            if (this.councilId) {
              this.getAllUsers();
            } else {
              this.getUserByFilter()
            }
            // this.users.splice(userIndex,1,event);
           // Handle the error here in case of login failure
         }});
        }
        // this.users.splice(userIndex,1,event);
        // this.initializeColumns();
        // this.getAllUsers();
    
     }
     
   })
  }

  initializeColumns(): void {
    this.usersTableColumns = [
      // {
      //   columnDef: 'Id',
      //   header: 'ID',
      //   isSortable: true,
      //   cell: (element: Record<string, any>) => `${element['Id']}`
      // },
      {
        columnDef: 'id',
        header: 'S.No',
        isSortable: false,
        colType: 'SerNo',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '50px'
        }
      },
      {
        columnDef: 'name',
        header: 'Full name',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['name']}`
      },
      {
        columnDef: 'username',
        header: 'Email',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['username']}`
      },
      {
        columnDef: 'phone',
        header: 'Phone Number',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['phone']}`
      },
      {
        columnDef: 'role',
        header: 'Role',
        isSortable: true,
        cell: (element: Record<string, any>) => {
          return getRole(element['role']);
        }
      },
      {
        columnDef: 'councilName',
        header: 'Council',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['councilName']}`
      },
      {
        columnDef: 'departmentName',
        header: 'Department',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['departmentName']}`
      },
      {
        columnDef: 'createdDate',
        header: 'Created Date',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['createdDate']}`
      },
      {
        columnDef: 'isActive',
        header: 'Account Status',
        isSortable: true,
        cell: (element: Record<string, any>) => {
          return  element['isActive'] ? 'Active' : "Inactive";
        }
      },
      {
        columnDef: 'isLink',
        header: '',
        isSortable: false,
        isMenuOption:true,
        cell: (element: Record<string, any>) => ``
      }

    ];
  }

  getAllUsers() {
    this.isDataLoading = true;
    const request = {
      page: this.pageIndex,// need to check once code is deployed.
      size: this.pageSize,
      searchKeyword:this.searchParams
      }
      //console.log(request);
    this.userService.getAllUsers(request).subscribe({
      next: (res) => {
        this.isDataLoading = false;
        this.users = res.responseData.result.map((user:any) => {
          //console.log("Response =>", res.responseData.result);
          this.length = res.responseData.count;
          const { username, firstName, lastName, enabled, email, attributes, id, keycloakId, createdDate} = user;
          let name = '';
          let isActive = '';
          let role = '';
          let phone = '';
          let councilName = 'NA';
          let departmentName = 'NA';
          let formatedDate = '';
          let showToggle = true;
          if(firstName && lastName !== undefined) {
            name = `${firstName} ${' '} ${lastName}`;
          }
          if(enabled) {
            isActive = enabled == true? 'Active': 'Inactive';
          }
          if (createdDate) {
            formatedDate = this.datePipe.transform(createdDate, 'MM/dd/yyyy')?.toString() + '';
          }
          if(attributes !== undefined) {
            if(attributes.hasOwnProperty('Role') && attributes.Role[0]) {
              role = attributes.Role[0];
            } else if (attributes.role && attributes.role[0]) {
              role = attributes.role[0];
            }
            if (role === 'ADMIN') {
              showToggle = false;
            }
            if(attributes.hasOwnProperty('phoneNumber') && attributes.phoneNumber) {
              phone = attributes.phoneNumber
            }
            if(attributes.councilName) {
              councilName = attributes.councilName;
            }
            if (attributes.departmentName) {
              departmentName = attributes.departmentName;
            }
          }
          return {
            id,
            keycloakId,
            name,
            username,
            phone,
            isActive,
            role,
            councilName: councilName,
            departmentName: departmentName,
            createdDate: formatedDate,
            showToggle: showToggle
          }
        })
        this.listLength = this.users.length;
      },
      error: (err) => {
        const errorMessage = err.error.error_message ? err.error.error_message : err.error.error;
        this.isDataLoading = false;
        this.toastrService.showToastr(errorMessage, 'Error', 'error', '');
        // Handle the error here in case of login failure
      }
    });
  }

  handlePageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex; // cross verify this based on count returned
    this.pageSize = event.pageSize;
    this.length = event.length;
    if (this.councilId) {
      this.getAllUsers();
    } else {
      this.getUserByFilter()
    }
}

  getCouncils() {
    this.sharedService.getCouncils()
      .subscribe({
        next: (response) => {
          if (response) {
            this.councilsList = response.responseData;
          }
        },
        error: (error) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
        }
      });
  }

  getDeparmentsList(ticketCouncilId: any) {
    this.departmentsList = [];
    const conucil: any = this.councilsList.find((council: any) => council.ticketCouncilId === ticketCouncilId);
    if (conucil && conucil.ticketDepartmentDtoList && conucil.ticketDepartmentDtoList.length > 0) {
      this.noDepartments = false;
      this.departmentsList = conucil.ticketDepartmentDtoList
    } else {
      this.noDepartments = true;
    }
  }

  onClickApplyFilter(event:any){
    // this.grievanceType = event.grievanceType
    this.councilId = event.council;
    this.departmentId = event.department;
    this.roleID = event.role;
    this.getUserByFilter();
  }

  resetFilterValueData(event:any){
    this.councilId = undefined;
    this.departmentId = undefined;
    this.roleID = undefined;
    this.departmentsList = [];
    this.searchForm.reset();
    this.pageIndex = 0;
    if (event !== undefined) {
      this.getAllUsers();
    }
  }

  getUserByFilter() {
    this.isDataLoading = true;
    const request = {
      page: this.pageIndex,// need to check once code is deployed.
      size: this.pageSize,
      searchKeyword:this.searchParams,
      filter: {
        "role": this.roleID === '' ? null : this.roleID, 
        "councilId": this.councilId,
        "departmentId": this.departmentId
      }
    }
    this.userService.getUserByFilter(request).subscribe({
      next: (res) => {
        this.isDataLoading = false;
        this.users = res.responseData.result.map((user:any) => {
          this.length = res.responseData.count;
          const { username, firstName, lastName, enabled, email, attributes, id, keycloakId, createdDate} = user;
          let name = '';
          let isActive = '';
          let role = '';
          let phone = '';
          let councilName = 'NA';
          let departmentName = 'NA';
          let formatedDate = '';
          let showToggle = true;
          if(firstName && lastName !== undefined) {
            name = `${firstName} ${' '} ${lastName}`;
          }
          if(enabled) {
            isActive = enabled == true? 'Active': 'Inactive';
          }
          if (createdDate) {
            formatedDate = this.datePipe.transform(createdDate, 'MM/dd/yyyy')?.toString() + '';
          }
          if(attributes !== undefined) {
            if(attributes.hasOwnProperty('Role') && attributes.Role[0]) {
              role = attributes.Role[0];
            } else if (attributes.role && attributes.role[0]) {
              role = attributes.role[0];
            }
            if (role === 'ADMIN') {
              showToggle = false;
            }
            if(attributes.hasOwnProperty('phoneNumber') && attributes.phoneNumber) {
              phone = attributes.phoneNumber
            }
            if(attributes.councilName) {
              councilName = attributes.councilName;
            }
            if (attributes.departmentName) {
              departmentName = attributes.departmentName;
            }
          }
          return {
            id,
            keycloakId,
            name,
            username,
            phone,
            isActive,
            role,
            councilName: councilName,
            departmentName: departmentName,
            createdDate: formatedDate,
            showToggle: showToggle
          }
        })
        this.listLength = this.users.length;
      },
      error: (err) => {
        const errorMessage = err.error.error_message ? err.error.error_message : err.error.error;
        this.isDataLoading = false;
        this.toastrService.showToastr(errorMessage, 'Error', 'error', '');
      }
    });
  }
}
