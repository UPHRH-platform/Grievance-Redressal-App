import { Component } from '@angular/core';
import { TableColumn, DashboardTableData, DashboardAnalytics } from '../../../interfaces/interfaces';
import { BreadcrumbItem, ConfigService } from 'src/app/shared';
import { DashboardService } from '../services/dashboard.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent {
  isDataLoading : boolean = false;
  dashboardData: any = {};
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'Dashboard', url: '/dashboard' },
  ];
  assignmentMatrixColumns: any = [];
  assignmentMatrixData: any = [];
  performanceIndicatorData: any = {};
  resolutionMatrixData: any = [];
  resolutionMatrixColumns: any = [];
  grievancesTypes:any[]=[];
  public assignGrievanceTypeForm:FormGroup;

  constructor(private dashboardService: DashboardService, private configService: ConfigService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.grievancesTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.initializeColumns();
    this.getDashboardData();
    this.createAssignForm();
  }

  createAssignForm(){
    this.assignGrievanceTypeForm = this.formBuilder.group({
      grievanceType: new FormControl('')
    })
  }

  initializeColumns(): void {
    this.assignmentMatrixColumns = [
      {
        columnDef: 'id',
        header: '#',
        isSortable: false,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['id']}`
},
      {
                columnDef: 'tag',
                header: 'Tag',
                isSortable: false,
                isLink: false,
                cell: (element: Record<string, any>) => `${element['tag']}`
    },
    {
      columnDef: 'value',
      header: 'Number of tickets',
      isSortable: false,
      isLink: false,
      cell: (element: Record<string, any>) => `${element['value']}`
},

    ]
    this.resolutionMatrixColumns = [
      {
        columnDef: 'id',
        header: '#',
        isSortable: false,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['id']}`
},
      {
        columnDef: 'departmentName',
        header: 'Department',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['departmentName']}`
},
{
  columnDef: 'total',
  header: 'Total Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['total']}`
},
{
  columnDef: 'isJunk',
  header: 'Junk Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['isJunk']}`
},
{
  columnDef: 'isClosed',
  header: 'Resolved Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['isClosed']}`
},

{
  columnDef: 'isEscalated',
  header: 'Escalated',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['isEscalated']}`
},

{
  columnDef: 'isOpen',
  header: 'Pending Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['isOpen']}`
},
{
  columnDef: 'openTicket',
  header: 'Open Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['openTicket']}`
},
{
  columnDef: 'unassigned',
  header: 'Unassigned',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['unassigned']}`
},
    ]
  }

  getDashboardData() {
      this.isDataLoading = true;
      setTimeout(() => {
        this.isDataLoading = false;
      }, 2000);
      this.dashboardData = this.dashboardService.getDashboardData().body;
      //assignmentmatrix data
      const tag = [];
      const value:any = [];
      for(const key in this.dashboardData.assignmentMatrix) {
          tag.push(this.camelCaseToWords(key));
          value.push(this.dashboardData.assignmentMatrix[key])
      }
      tag.map((obj, index) => {
        this.assignmentMatrixData.push({
          id: index + 1,
          tag: obj,
          value: value[index]
        })
      })
      this.dashboardData.resolutionMatrix.map((obj: any, index: number) => {
        let i = index;
        for(const key in obj) {
          i = i + 1;
          this.resolutionMatrixData.push({id: i, departmentName: this.camelCaseToWords(key), ...obj[key]});
        }
      })
    }

    camelCaseToWords(s: string) {
      const result = s.replace(/([a-zA-Z])([A-Z])([a-z])/g, '$1 $2$3');
      return result.charAt(0).toUpperCase() + result.slice(1);
    }

    grievanceSelected(grievance: Event) {
      console.log(grievance)
    }
}

