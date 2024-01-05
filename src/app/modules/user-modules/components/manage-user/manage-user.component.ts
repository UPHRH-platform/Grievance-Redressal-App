import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {  TableColumn, userTableData } from 'src/app/interfaces/interfaces';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { BreadcrumbItem } from 'src/app/shared';
import { UserService } from '../../services/user.service';
import { getRole } from 'src/app/shared';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';

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
    { label: 'MANAGE USERS', url: '/user-manage' },
  ];
  pageSize: number = 10;
  pageIndex: number = 0;
  length: number = 0;
  listLength: number = 0;
  searchForm:FormGroup;
  searchParams:string = '';
  private timeoutId: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private toastrService: ToastrServiceService 
  ){
    this.searchForm =  new FormGroup({
      searchData:  new FormControl('')
    })
  
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.initializeColumns();
  }

  applyFilter(searchterms:any){
    clearTimeout(this.timeoutId) 
     this.searchParams  = searchterms
      this.timeoutId= setTimeout(()=>{
      this.getAllUsers()
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
            this.getAllUsers();
          },
          error: (err) => {
            this.toastrService.showToastr(err, 'Error', 'error', '');
            this.getAllUsers();
          }
        })
      }
      else {
        this.userService.deactivateUser(request).subscribe({
          next: (res) => {
            // this.users.splice(userIndex,1,updatedUserData);
            this.getAllUsers();
         },
         error: (err) => { 
          this.toastrService.showToastr(err, 'Error', 'error', '');
          this.getAllUsers();
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
          const { username, firstName, lastName, enabled, email, attributes, id, keycloakId} = user;
          let name = '';
          let isActive = '';
          let role = '';
          let phone = '';
          if(firstName && lastName !== undefined) {
            name = `${firstName} ${' '} ${lastName}`;
          }
          if(enabled) {
            isActive = enabled == true? 'Active': 'Inactive';
          }
          if(attributes !== undefined) {
            if(attributes.hasOwnProperty('Role') && attributes.Role[0]) {
              role = attributes.Role[0];
            } else if (attributes.role && attributes.role[0]) {
              role = attributes.role[0];
            }
            if(attributes.hasOwnProperty('phoneNumber') && attributes.phoneNumber) {
              phone = attributes.phoneNumber
            }
          }
          return {
            id,
            keycloakId,
            name,
            username,
            phone,
            isActive,
            role
          }
        })
        this.listLength = this.users.length;
      },
      error: (err) => {
        this.isDataLoading = false;
        this.toastrService.showToastr(err, 'Error', 'error', '');
        // Handle the error here in case of login failure
      }
    });
  }

  handlePageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex; // cross verify this based on count returned
    this.pageSize = event.pageSize;
    this.length = event.length;
    this.getAllUsers();
}

}
