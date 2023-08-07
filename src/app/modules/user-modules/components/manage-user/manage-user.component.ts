import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {  TableColumn, userTableData } from 'src/app/interfaces/interfaces';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { BreadcrumbItem } from 'src/app/shared';
import { UserService } from '../../services/user.service';
import { getRole } from 'src/app/shared';

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
    private userService: UserService 
  ){

  }

  ngOnInit(): void {
    this.getAllUsers()
    this.initializeColumns()
    
  }

  goToUserDetail(userDetail?:any){
    if(userDetail){
      this.router.navigate(['/user-manage/userform'],{ queryParams: userDetail})
    }
    else {
      this.router.navigate(['/user-manage/userform'])
    }
  }


  
  toggleUserStatus(event:any) {
   const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
    data: {},
    maxWidth:'400vw',
    maxHeight:'100vh',
    height:'30%',
    width:'30%',
    disableClose: true
   });
   dialogRef.afterClosed().subscribe(result=>{
    console.log('dialog closed')
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
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.isDataLoading = false;
        this.users = res.responseData.map((user:userTableData) => {
          const { name, username,  phone, isActive, roles } = user;
          const role= roles[0].name;
          return {
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
        console.error(err);
        // Handle the error here in case of login failure
      }
    });
  }


}
