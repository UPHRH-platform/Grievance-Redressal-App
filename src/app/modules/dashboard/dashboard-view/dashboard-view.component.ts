import { Component } from '@angular/core';
import { TableColumn, DashboardTableData, DashboardAnalytics } from '../../../interfaces/interfaces';
import { BreadcrumbItem, ConfigService } from 'src/app/shared';
import { DashboardService } from '../services/dashboard.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';

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
  startDate = new Date("2020/03/03");
  endDate = new Date();
  ccList: any = [];
  filterForm: FormGroup;
  filterDateRange = {startDate: '', endDate: ''};
  public assignGrievanceTypeForm:FormGroup;
  grievanceTypeNames: any = [];
  constructor(private dashboardService: DashboardService, private configService: ConfigService, private formBuilder: FormBuilder, private toastrService: ToastrServiceService) {
  }

  ngOnInit(): void {
    this.grievancesTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.filterForm = this.formBuilder.group({
      grievanceType: new FormControl(),
      startDate: new FormControl(this.startDate),
      endDate:new FormControl(this.endDate)
    })
    this.getDashboardObjectData(this.filterForm.value.startDate, this.filterForm.value.endDate);
  }

  compareFn(cmp1: any,cmp2: any){
    return cmp1 && cmp2 ? cmp1.id === cmp2.id : cmp1 == cmp2;
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
  columnDef: 'openTicketGte15',
  header: 'Open Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['openTicketGte15']}`
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

  getDashboardObjectData(startDate:any, endDate: any) {
    this.dashboardData = [];
    const tag:any = [];
    const value:any = [];
    const resolutionMatrix: any = [];
    this.assignmentMatrixData = [];
    this.resolutionMatrixData = [];
      this.isDataLoading = true;
      const request = {
        date: {
          to: endDate.getTime(),
          from: startDate.getTime()
        },
        filter: {
          ccList: this.ccList
        }
      }
      setTimeout(() => {
        this.isDataLoading = false;
      }, 2000);
      this.dashboardService.getDashboardData(request).subscribe({
        next: (res) => {
          localStorage.setItem('filters', JSON.stringify(request));
          //  this.saveFilter();
          this.dashboardData = res.responseData;
          this.initializeColumns();
          if(this.dashboardData){
            // assignmentMatrix
            for(const key in this.dashboardData.assignmentMatrix) {
                tag.push(this.camelCaseToWords(key));
                value.push(this.dashboardData.assignmentMatrix[key])
            }
            tag.map((obj:any, index:number) => {
              this.assignmentMatrixData.push({
                id: index + 1,
                tag: obj,
                value: value[index]
              })
            })
            // resolutionMatrix
            resolutionMatrix.push(this.dashboardData.resolutionMatrix);
            this.dashboardData.resolutionMatrixArray = resolutionMatrix;
            //console.log(this.dashboardData.resolutionMatrixArray);
        this.dashboardData.resolutionMatrixArray.map((obj: any, index: number) => {
        let i = index;
        for(const key in obj) {
          i = i + 1;
          this.resolutionMatrixData.push({id: i, departmentName: this.camelCaseToWords(key), ...obj[key]});
        }
      })
          }
        },
        error: (err) => {
          this.toastrService.showToastr(err, 'Error', 'error', '');
          // Handle the error here in case of login failure
        }
      })
      //assignmentmatrix data
     
      
    }

    camelCaseToWords(s: string) {
      const result = s.replace(/([a-zA-Z])([A-Z])([a-z])/g, '$1 $2$3');
      return result.charAt(0).toUpperCase() + result.slice(1);
    }

    grievanceSelected(grievance: any) {
      this.ccList = grievance.value;
    }

    changeEvent(type: string, event: any) {
      if(type == 'startDate') {
       this.filterForm.patchValue({
         startDate: event.value
       })
      }
      if(type === 'endDate') {
        this.filterForm.patchValue({
          endDate: event.value
        })
      }
    }

    applyFilter() {
      this.getDashboardObjectData(this.filterForm.value.startDate, this.filterForm.value.endDate);
    }

    resetFilter() {
      this.filterForm.reset(this.filterForm.value);
      this.filterForm.setValue({
        startDate: this.startDate,
        endDate: this.endDate,
        grievanceType: ''
      })
      this.getDashboardObjectData(this.filterForm.value.startDate, this.filterForm.value.endDate);
    }
}

