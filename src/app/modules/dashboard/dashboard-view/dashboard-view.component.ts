import { Component } from '@angular/core';
import { BreadcrumbItem, exportToExcel } from 'src/app/shared';
import { DashboardService } from '../services/dashboard.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';


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
  startDate = new Date("2020/03/03");
  endDate = new Date();
  ccList: any = [];
  filterForm: FormGroup;
  councilsList: any[] = [];
  departmentsList: any[] = [];
  usersList: any[] = [];
  councilName = 'All Councils';
  usersLoading = false;
  // filterDateRange = {startDate: '', endDate: ''};
  public assignGrievanceTypeForm:FormGroup;
  grievanceTypeNames: any = [];
  constructor(private dashboardService: DashboardService, private formBuilder: FormBuilder, private toastrService: ToastrServiceService,
    private router: Router, private sharedService: SharedService, private datePipe: DatePipe
    // private papa: Papa
    ) {
  }

  ngOnInit(): void {
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
        columnDef: 'councilName',
        header: 'Council',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['councilName']}`
      },
      {
        columnDef: 'departmentName',
        header: 'Department',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['departmentName']}`
},
{
  columnDef: 'Total',
  header: 'Total Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['Total']}`
},
{
  columnDef: 'Junk',
  header: 'Junk Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['Junk']}`
},
{
  columnDef: 'Closed',
  header: 'Resolved Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['Closed']}`
},

{
  columnDef: 'Escalated',
  header: 'Escalated',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['Escalated']}`
},

{
  columnDef: 'Pending',
  header: 'Pending Ticket',
  isSortable: true,
  isLink: false,
  cell: (element: Record<string, any>) => `${element['Pending']}`
},
// {
//   columnDef: 'openTicketGte15',
//   header: 'Open Ticket',
//   isSortable: true,
//   isLink: false,
//   cell: (element: Record<string, any>) => `${element['openTicketGte15']}`
// },
// {
//   columnDef: 'Unassigned',
//   header: 'Unassigned',
//   isSortable: true,
//   isLink: false,
//   cell: (element: Record<string, any>) => `${element['Unassigned']}`
// },
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
          to: endDate.getTime() + ((23*60*60 + 59*60+59) * 1000),
          from: startDate.getTime()
        },
        filter: {
          // ccList: this.ccList
          ticket_council_id: this.filterForm.get('council')?.value,
          ticket_department_id: this.filterForm.get('department')?.value,
          assigned_to_id: this.filterForm.get('user')?.value
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
        // to add total count colum wise
        // const totalCountRow = {
        //   id : '',
        //   councilName: '',
        //   departmentName: '',
        //   Total: 0,
        //   Junk: 0,
        //   Closed: 0,
        //   Escalated: 0,
        //   Pending: 0
        // }
        for(const council in obj) {
          if (council.toString().toLocaleLowerCase().indexOf('other') < 0) {
            const departments = obj[council];
            for (const key in departments) {
              i = i + 1;
              // totalCountRow['Total'] = totalCountRow['Total'] + obj[council][key]['Total'];
              // totalCountRow['Junk'] = totalCountRow['Junk'] + obj[council][key]['Junk'];
              // totalCountRow['Closed'] = totalCountRow['Closed'] + obj[council][key]['Closed'];
              // totalCountRow['Escalated'] = totalCountRow['Escalated'] + obj[council][key]['Escalated'];
              // totalCountRow['Pending'] = totalCountRow['Pending'] + obj[council][key]['Pending'];
              this.resolutionMatrixData.push({id: i, councilName: this.camelCaseToWords(council) , departmentName: this.camelCaseToWords(key), ...obj[council][key]});
            }
          }
        }
        // this.resolutionMatrixData.push(totalCountRow);
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
      // .pipe((mergeMap((response) => {
      //   const counciles = response.responseData.filter((council: any) => council.status);
      //   return of(counciles);
      // })))
      .subscribe({
        next: (response) => {
          if (response) {
            this.councilsList = response.responseData;
          }
        },
        error: (error) => {
          this.toastrService.showToastr(error.error.error, 'Error', 'error');
        }
      });
  }

  getDeparmentsList(ticketCouncilId: any) {
    this.departmentsList = [];
    this.usersList = [];
    this.filterForm.get('department')?.reset();
    this.filterForm.get('user')?.reset();
    const council: any = this.councilsList.find((council: any) => council.ticketCouncilId === ticketCouncilId);
    this.councilName = council?.ticketCouncilName;
    if (council && council.ticketDepartmentDtoList) {
      this.departmentsList = council.ticketDepartmentDtoList
      // .filter((department: any) => department.status);
    }
  }

  getUsers() {
    if (this.filterForm.get('council')?.value && this.filterForm.get('department')?.value) {
      const allUsers = true;
      this.usersLoading = true;
      this.usersList = [];
      this.filterForm.get('user')?.reset();
      this.sharedService.getUsersByCouncilDetapartmen(this.filterForm.get('council')?.value, this.filterForm.get('department')?.value, allUsers)
      .subscribe({
        next: (response: any) => {
          this.usersLoading = false;
          if (response && response.responseData) {
            this.usersList = response.responseData;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.usersLoading = false;
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
      this.ccList = [];
      this.councilName = 'All Councils'
      this.getDashboardObjectData(this.filterForm.value.startDate, this.filterForm.value.endDate);
    }

  downloadDetails() {
    const filterDetails = {
      sheetName: 'Summary',
      downloadObject: {},
      headers: ['Type', 'Value'],
    }
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
      headers: ['Council', 'Department', 'Total Ticket', 'Junk Ticket', 'Resolved Ticket', 'Escalated', 'Pending Ticket'],
    }

    let departmentName = 'All Departments';
    let userName = 'All users'
    if (this.filterForm.get('department')?.value) {
      const selectedDepartment = this.departmentsList.find((department) => department.ticketDepartmentId === this.filterForm.get('department')?.value)
      departmentName = selectedDepartment ? selectedDepartment.ticketDepartmentName : departmentName;
    }
    if (this.filterForm.get('user')?.value) {
      const selecteduser = this.usersList.find((user) => user.id === this.filterForm.get('user')?.value)
      userName = selecteduser ? `${selecteduser.firstName} ${selecteduser.lastName}` : userName;
    }
    const startDate = this.datePipe.transform(this.filterForm.value.startDate, 'MM/dd/yyyy');
    const endDate = this.datePipe.transform(this.filterForm.value.endDate, 'MM/dd/yyyy')
    filterDetails.downloadObject = [
      {
        type: 'Council',
        value: this.councilName,
      },
      {
        type: 'Department',
        value: departmentName,
      },
      {
        type: 'officer name',
        value: userName,
      },
      {
        type: 'Date range',
        value: `${startDate} - ${endDate}`,
      }
    ];

    if(this.dashboardData) {
      if(this.dashboardData.assignmentMatrix) {
        const assignmentDetails = this.dashboardData.assignmentMatrix;
        assignmentMatrix.downloadObject = [
          {
            tag: 'Total',
            ticketCount: assignmentDetails['Total'],
          },
          {
            tag: 'Pending',
            ticketCount: assignmentDetails['Pending'],
          },
          {
            tag: 'Closed',
            ticketCount: assignmentDetails['Closed'],
          },
          {
            tag: 'Junk',
            ticketCount: assignmentDetails['Junk'],
          },
          {
            tag: 'Escalated',
            ticketCount: assignmentDetails['Escalated'],
          },
          {
            tag: 'Unassigned',
            ticketCount: assignmentDetails['Unassigned'],
          },
        ]
      }
      if(this.dashboardData.performanceIndicators) {
        const performanceperformance = this.dashboardData.performanceIndicators;
        performanceIndicators.downloadObject = [
          {
            item: 'Escalation Percentage',
            value: performanceperformance['Escalation Percentage'],
          },
          {
            item: 'Nudge Ticket Percentage',
            value: performanceperformance['Nudge Ticket Percentage'],
          },
          // {
          //   item: 'Open Ticket Gte21',
          //   value: performanceperformance['Open Ticket Gte21'],
          // },
          {
            item: 'Total',
            value: performanceperformance['Total'],
          },
          {
            item: 'Turn Around Time',
            value: performanceperformance['Turn Around Time'],
          },
        ]
      }
      if(this.dashboardData.resolutionMatrix) {
        const resolutionDetails = this.dashboardData.resolutionMatrix;
        const counciles = Object.keys(resolutionDetails);
        const downloadObject: any = [];
        counciles.forEach((council) => {
          if (council.toString().toLocaleLowerCase().indexOf('other') < 0) {
            const keys = Object.keys(resolutionDetails[council]);
            keys.forEach((key) => {
              const resolution = {
                Council: council,
                department: key,
                totalticket: resolutionDetails[council][key]['Total'],
                junkticket: resolutionDetails[council][key]['Junk'],
                resolvedticket: resolutionDetails[council][key]['Closed'],
                escalated: resolutionDetails[council][key]['Escalated'],
                pendingticket: resolutionDetails[council][key]['Pending'],
                // openticket: resolutionDetails[key].openTicketGte15,
                // unassigned: resolutionDetails[council][key]['Unassigned']
              }
              downloadObject.push(resolution);
            })
          }
        })
        resolutionMatrix.downloadObject = downloadObject;
      }
    }

    const downloadObjects = {
      fileName: 'dashboard.xlsx',
      objectsList: [filterDetails, assignmentMatrix, performanceIndicators, resolutionMatrix]
    }
    exportToExcel(downloadObjects);
  }
}

