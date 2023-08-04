import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { TableColumn, GrievancesTableData } from '../../../../interfaces/interfaces';
import { Tabs, Roles } from 'src/app/shared/config';
import { UserService } from 'src/app/modules/user-modules/services/user.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BreadcrumbItem } from 'src/app/shared';


@Component({
  selector: 'app-grievance-management',
  templateUrl: './grievance-management.component.html',
  styleUrls: ['./grievance-management.component.scss']
})
export class GrievanceManagementComponent  {
  grievances: GrievancesTableData[] = [];
  grievancesTableColumns: TableColumn[] = [];
  isDataLoading : boolean = false;
  userRole: string;
  tabs: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'Grievance List', url: 'grievance/manage-tickets' },
  ];
  constructor( 
    private router: Router,
    private userService: UserService ){
    }

  ngOnInit(): void {
    this.userRole = this.userService.getUserRoles()[0];
    this.initializeTabs();
  }

  initializeTabs(): void {
    switch(this.userRole ){
      case Roles.NODAL_OFFICER:
        this.tabs = Tabs['Nodal Officer'];
        break;
      case Roles.SECRETARY:
        this.tabs = Tabs['Secretary'];
        break;
      case Roles.GRIEVANCE_NODAL:
        this.tabs = Tabs['Grievance Nodal'];
        break;
    }
    //Initialize column as per user Role
    this.initializeColumns();
    //Fetch grievances as per user  role
    this.getgrievances();
  }

  initializeColumns(): void {
    this.grievancesTableColumns = [
      {
        columnDef: 'id',
        header: 'ID',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['id']}`
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
        id: "340",
        grievanceRaiser: 'Kalpana Shrivastav',
        userType:'Institue',
        status:"Not-Assigned",
        raiserType:'Affiliation',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description.This is a lorem ipsum description which is pretty much large enough to test a description",
        attachedDocs:["Doc 1","Doc2"]
      },
      {
        id: "327",
        grievanceRaiser: 'Devpratap Nagendra',
        userType:'Candiadate',
        raiserType:'Others',
        status:"Not-Assigned",
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description",
        attachedDocs:["Doc 1","Doc2"]
      },
      {
        id: "336",
        grievanceRaiser: 'Mani Charri',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "335",
        grievanceRaiser: 'Geethesh Misra',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "334",
        grievanceRaiser: 'Vinodini Vaishnav',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "333",
        grievanceRaiser: 'Apporva Nautiyal',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "332",
        grievanceRaiser: 'Nancy Jain',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "331",
        grievanceRaiser: 'Deepak Sharma',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "330",
        grievanceRaiser: 'Usha Singh',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "27",
        grievanceRaiser: 'Kamlesh Pandey',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
      },
      {
        id: "317",
        grievanceRaiser: 'Pappiya Mukherjee',
        userType:'Candiadate',
        status:"Not-Assigned",
        raiserType:'Others',
        creationTime: "23-06-2023",
        escalationTime: "23-12-2023",
        description: "This is a lorem ipsum description which is pretty much large enough to test a description"
      }
     
    ]; 
  }

  onTabChange(event: MatTabChangeEvent): void {
    // Here  we  have userrole and tab index with these 2 we know we need to fetch data for which tab of which user role so we pass relevant payload in get grievance service
    const selectedIndex = event.index;
    const selectedTab = this.tabs[selectedIndex].name;
    this.getgrievances();
  }

  onClickItem(e: any) {
    console.log(e?.id)
    let id = parseInt(e?.id)
    //this.router.navigate(['/:'+id], {state: {data: e}});
    this.router.navigate(['/grievance',  e.id ], {state : {data: e}} );
   // this.router.navigate(['/grievance', e.id]);
  }

}
