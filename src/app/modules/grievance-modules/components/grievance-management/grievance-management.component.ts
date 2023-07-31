import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { TableColumn, GrievancesTableData } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-grievance-management',
  templateUrl: './grievance-management.component.html',
  styleUrls: ['./grievance-management.component.scss']
})
export class GrievanceManagementComponent  {


  grievances: GrievancesTableData[] = [];
  grievancesTableColumns: TableColumn[] = [];
  isDataLoading : boolean = false;
  constructor( 
    private router: Router ){}

  ngOnInit(): void {
    this.initializeColumns();
    console.log(this.grievancesTableColumns)
    this.getgrievances();
    console.log(this.grievances)
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

  onClickItem(e: any) {
    console.log(e?.id)
    let id = parseInt(e?.id)
    //this.router.navigate(['/:'+id], {state: {data: e}});
    this.router.navigate(['/grievance',  e.id ], {state : {data: e}} );
   // this.router.navigate(['/grievance', e.id]);
  }

  raiseNewGrievance(){
    
  }
}
