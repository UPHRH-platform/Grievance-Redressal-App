import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GrievancesTableData, TableColumn, userTableData } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  isDataLoading:boolean = false;
  grievances: userTableData[] = [];
  grievancesTableColumns: TableColumn[] = [];
  dataItem:any;
  constructor(private router: Router){

  }

  ngOnInit(): void {
    this.getgrievances()
    this.initializeColumns()
    
  }

  addUserFn(event?:any){
    console.log('eee',event)
    this.dataItem = event
    if(event){
      this.router.navigate(['/user-manage/userform'],{queryParams:this.dataItem})
    }
    else {
      this.router.navigate(['/user-manage/userform'])
    }
   
  }
  initializeColumns(): void {
    this.grievancesTableColumns = [
      // {
      //   columnDef: 'Id',
      //   header: 'ID',
      //   isSortable: true,
      //   cell: (element: Record<string, any>) => `${element['Id']}`
      // },
      {
        columnDef: 'fullName',
        header: 'Full name',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['fullName']}`
      },
      {
        columnDef: 'email',
        header: 'Email',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['email']}`
      },
      {
        columnDef: 'phoneNumber',
        header: 'Phone Number',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['phoneNumber']}`
      },
      {
        columnDef: 'role',
        header: 'Role',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['role']}`
      },
      {
        columnDef: 'accountStatus',
        header: 'Account Status',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['accountStatus']}`
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

  getgrievances() {
    this.isDataLoading = true;
    setTimeout(() => {
      this.isDataLoading = false;
    }, 2000);
    this.grievances = [
      {
        fullName: 'Kalpana Shrivastav',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Amit Kumar',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Salman Khan',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Kajal kumari',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'shubham sahoo',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Bharat kumar',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'devendra Singh',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Vinod Shiva',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Kalpana Shrivastav',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Kalpana Shrivastav',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
      {
        fullName: 'Kalpana Shrivastav',
        email:'name@email.com',
        phoneNumber:987654321,
        role: "Nodal officer",
        accountStatus: "Active",
      },
     
    ];
    
  }


}
