import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';

import { TableColumn, GrievancesTableData } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-grievance-management',
  templateUrl: './grievance-management.component.html',
  styleUrls: ['./grievance-management.component.css']
})
export class GrievanceManagementComponent  {


  grievances: GrievancesTableData[] = [];
  grievancesTableColumns: TableColumn[] = [];
  isDataLoading : boolean = false;
  constructor(){}

  ngOnInit(): void {
    this.initializeColumns();
    console.log(this.grievancesTableColumns)
    this.getgrievances();
    console.log(this.grievances)
  }

  initializeColumns(): void {
    this.grievancesTableColumns = [
      {
        columnDef: 'Id',
        header: 'ID',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['Id']}`
      },
      {
        columnDef: 'grievanceRaiser',
        header: 'Grievance Raiser',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['grievanceRaiser']}`
      },
      {
        columnDef: 'userType',
        header: 'User Type',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['userType']}`
      },
      {
        columnDef: 'raiserType',
        header: 'Raiser Type',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['raiserType']}`
      },
      {
        columnDef: 'creationTime',
        header: 'Creation Time',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['creationTime']}`
      },
      {
        columnDef: 'escalationTime',
        header: 'Escalation time',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['escalationTime']}`
      },
      {
        columnDef: 'isLink',
        header: '',
        isSortable: false,
        isLink: true,
        cell: (element: Record<string, any>) => `View Ticket`
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
        Id: "340",
        grievanceRaiser: 'Kalpana Shrivastav',
        userType:'',
        raiserType:'',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "327",
        grievanceRaiser: 'Devpratap Nagendra',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "336",
        grievanceRaiser: 'Mani Charri',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "335",
        grievanceRaiser: 'Geethesh Misra',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "334",
        grievanceRaiser: 'Vinodini Vaishnav',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "333",
        grievanceRaiser: 'Apporva Nautiyal',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "332",
        grievanceRaiser: 'Nancy Jain',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "331",
        grievanceRaiser: 'Deepak Sharma',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "330",
        grievanceRaiser: 'Usha Singh',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "27",
        grievanceRaiser: 'Kamlesh Pandey',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      },
      {
        Id: "317",
        grievanceRaiser: 'Pappiya Mukherjee',
        userType:'Candiadate',
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
      }
     
    ];
    
  }

  removeItem(e: Event) {
    console.log(e)
  }
}
