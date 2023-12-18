import { Component } from '@angular/core';
import { BreadcrumbItem, ConfigService } from 'src/app/shared';
import { DashboardService } from '../services/dashboard.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { Router } from '@angular/router';

import { utils, writeFile } from 'xlsx';
import { SharedService } from 'src/app/shared/services/shared.service';
import { mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
export const exportToExcel = async (downloadObjects: any) => {
  if (downloadObjects && downloadObjects.objectsList) {
    const workbook = utils.book_new();
    downloadObjects.objectsList.forEach((element: any) => {
      const sheetName = element.sheetName ? element.sheetName : `Sheet ${workbook.SheetNames.length + 1}`
      const worksheet = utils.json_to_sheet([]);
      utils.sheet_add_aoa(worksheet, [element.headers])
      utils.book_append_sheet(workbook, worksheet, sheetName);
      utils.sheet_add_json(worksheet, element.downloadObject, { origin: 'A2', skipHeader: true });
    });
    writeFile(workbook, downloadObjects.fileName ? downloadObjects.fileName : 'data.xlsx');
  }
}

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
  councilsList: any[] = [];
  departmentsList: any[] = [];
  usersList: any[] = [];
  // filterDateRange = {startDate: '', endDate: ''};
  public assignGrievanceTypeForm:FormGroup;
  grievanceTypeNames: any = [];
  constructor(private dashboardService: DashboardService, private configService: ConfigService, private formBuilder: FormBuilder, private toastrService: ToastrServiceService,
    private router: Router, private sharedService: SharedService
    // private papa: Papa
    ) {
  }

  ngOnInit(): void {
    this.grievancesTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.filterForm = this.formBuilder.group({
      grievanceType: new FormControl(),
      startDate: new FormControl(this.startDate),
      endDate:new FormControl(this.endDate),
      council: new FormControl(),
      department: new FormControl(),
      user: new FormControl()
    })
    this.getDashboardObjectData(this.filterForm.value.startDate, this.filterForm.value.endDate);
    this.initializeColumns();
    this.getCouncils();
  }

  navigateToHome(){
    this.router.navigate(['/home'])
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
          // ccList: this.ccList
          councilId: this.filterForm.get('council')?.value,
          departmentId: this.filterForm.get('department')?.value,
          userId: this.filterForm.get('user')?.value
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
          // this.initializeColumns();
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

  getCouncils() {
    this.sharedService.getCouncils()
      .pipe((mergeMap((response) => {
        const counciles = response.responseData.filter((council: any) => council.status);
        return of(counciles);
      })))
      .subscribe({
        next: (response) => {
          if (response) {
            this.councilsList = response;
          }
        },
        error: (error) => {
          this.toastrService.showToastr(error.error.error, 'Error', 'error');
        }
      });
  }

  getDeparmentsList(ticketCouncilId: any) {
    this.departmentsList = [];
    this.filterForm.get('department')?.reset();
    const conucil: any = this.councilsList.find((council: any) => council.ticketCouncilId === ticketCouncilId);
    if (conucil && conucil.ticketDepartmentDtoList) {
      this.departmentsList = conucil.ticketDepartmentDtoList.filter((department: any) => department.status);
    }
  }

  getUsers() {
    if (this.filterForm.get('council')?.value && this.filterForm.get('department')?.value) {
      this.dashboardService.getUsersByCouncilDetapartmen(this.filterForm.get('council')?.value, this.filterForm.get('department')?.value)
      .subscribe({
        next: (response: any) => {
          if (response && response.responseData) {
            this.usersList = response.responseData;
          }
        },
        error: (error: HttpErrorResponse) => {
          const errMessage = error.error.errMessage ? error.error.errMessage : error.error.error;
          this.toastrService.showToastr(errMessage, 'Error', 'error');
        }
      })
    }
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
      // this.filterForm.reset(this.filterForm.value);
      this.filterForm.setValue({
        startDate: this.startDate,
        endDate: this.endDate,
        grievanceType: '',
        council: null,
        department: null,
        user: null
      });
      this.departmentsList = [];
      this.usersList = [];
      this.ccList = []
      this.getDashboardObjectData(this.filterForm.value.startDate, this.filterForm.value.endDate);
    }

  downloadDetails() {
    const assignmentMatrix = {
      sheetName: 'Ticket assignment matrix',
      downloadObject: {},
      headers: ['Tag', 'Number of tickets'],
    }
    const performanceIndicators = {
      sheetName: 'Key performance indicators',
      downloadObject: {},
      headers: ['Item', 'Percentage'],
    }
    const resolutionMatrix = {
      sheetName: 'Ticket resolution matrix',
      downloadObject: {},
      headers: ['Department', 'Total Ticket', 'Junk Ticket', 'Resolved Ticket', 'Escalated', 'Pending Ticket', 'Open Ticket', 'Unassigned'],
    }

    if(this.dashboardData) {
      if(this.dashboardData.assignmentMatrix) {
        const assignmentDetails = this.dashboardData.assignmentMatrix;
        assignmentMatrix.downloadObject = [
          {
            tag: 'Total',
            ticketCount: assignmentDetails.total,
          },
          {
            tag: 'Is Open',
            ticketCount: assignmentDetails.isOpen,
          },
          {
            tag: 'Is Closed',
            ticketCount: assignmentDetails.isClosed,
          },
          {
            tag: 'Is Junk',
            ticketCount: assignmentDetails.isJunk,
          },
          {
            tag: 'Is Escalated',
            ticketCount: assignmentDetails.isEscalated,
          },
          {
            tag: 'Unassigned',
            ticketCount: assignmentDetails.unassigned,
          },
        ]
      }
      if(this.dashboardData.performanceIndicators) {
        const performanceperformance = this.dashboardData.performanceIndicators;
        performanceIndicators.downloadObject = [
          {
            item: 'Escalation Percentage',
            value: performanceperformance.escalationPercentage,
          },
          {
            item: 'Nudge Ticket Percentage',
            value: performanceperformance.nudgeTicketPercentage,
          },
          {
            item: 'Open Ticket Gte21',
            value: performanceperformance.openTicketGte21,
          },
          {
            item: 'Turn Around Time',
            value: performanceperformance.turnAroundTime,
          },
        ]
      }
      if(this.dashboardData.resolutionMatrix) {
        const resolutionDetails = this.dashboardData.resolutionMatrix;
        const keys = Object.keys(resolutionDetails);
        const downloadObject: any = [];
        keys.forEach((key) => {
          const resolution = {
            department: key,
            totalticket: resolutionDetails[key].total,
            junkticket: resolutionDetails[key].isJunk,
            resolvedticket: resolutionDetails[key].isClosed,
            escalated: resolutionDetails[key].isEscalated,
            pendingticket: resolutionDetails[key].isOpen,
            openticket: resolutionDetails[key].openTicketGte15,
            unassigned: resolutionDetails[key].unassigned
          }
          downloadObject.push(resolution);
        })
        resolutionMatrix.downloadObject = downloadObject;
      }
    }

    const downloadObjects = {
      fileName: 'dashboard.xlsx',
      objectsList: [assignmentMatrix, performanceIndicators, resolutionMatrix]
    }
    exportToExcel(downloadObjects);
  }
}

