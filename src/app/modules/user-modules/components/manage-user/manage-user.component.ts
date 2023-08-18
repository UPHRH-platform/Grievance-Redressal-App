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
    { label: 'User List', url: '/user-manage' },
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private toastrService: ToastrServiceService 
  ){

  }

  ngOnInit(): void {
    this.getAllUsers();
    this.initializeColumns();
  }

  goToUserDetail(userDetail?:any){
    if(userDetail){
      this.router.navigate(['/user-manage/userform'],{ queryParams: userDetail})
    }
    else {
      this.router.navigate(['/user-manage/userform'])
    }
  }


  
  // toggleUserStatus(event:any) {
  //   console.log("Event receieved", event);
  //   const status = event.isActive ? 'deactivate' : 'activate';
  //  const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
  //   data: { title: `Are you sure you want to ${status} ?`},
  //   maxWidth:'400vw',
  //   maxHeight:'100vh',
  //   height:'30%',
  //   width:'30%',
  //   disableClose: true
  //  });
  //  let updatedUserData = {...event};
  //  const userIndex = this.users.findIndex(user => user.id === updatedUserData.id);
  //  dialogRef.afterClosed().subscribe(isConfirmed=>{
  //    if(isConfirmed) {
  //     updatedUserData.isActive = !event.isActive;
  //     this.userService.createOrUpdateUser(updatedUserData).subscribe({
  //       next: (res) => {
  //         this.users.splice(userIndex,1,updatedUserData);
  //      },
  //      error: (err) => {  
  //         this.users.splice(userIndex,1,event);
  //        // Handle the error here in case of login failure
  //      }});
  //    }
  //    this.users.splice(userIndex,1,event);
  //    this.initializeColumns();
  //  })
  // }

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
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.isDataLoading = false;
        this.users = res.responseData.map((user:userTableData) => {
          const { name, username,  phone, isActive, roles, id } = user;
          const role= roles[0].name;
          return {
            id,
            name,
            username,
            phone,
            isActive,
            role
          }
        })
      },
      error: (err) => {
        this.isDataLoading = false;
        this.toastrService.showToastr(err, 'Error', 'error', '');
        // Handle the error here in case of login failure
      }
    });
  }


}
