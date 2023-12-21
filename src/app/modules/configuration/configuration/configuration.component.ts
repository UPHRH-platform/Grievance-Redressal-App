import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { BreadcrumbItem, ConfigurationTabs } from 'src/app/shared';
import { TableColumn } from 'src/app/interfaces/interfaces';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { mergeMap, of } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { exportToExcel } from '../../dashboard/dashboard-view/dashboard-view.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'Configuration Management', url: '/configuration' },
  ];
  isDataLoading = true;
  tabs: any[] = [];
  selectedTab: any;
  descriptionOfControl = 'Add Council';
  lableOfControl = 'Council Name';
  councilControlsList: any = [];
  configControl = new FormControl();
  councilControl = new FormControl();
  searchControl = new FormControl();
  userData: any;

  tableColumns: TableColumn[] = [];
  tableData: any = [];
  private timeoutId: any;
  councilsListForFilter: any = [];
  departmentsListForFilter: any = [];
  apiSubscribe: any;

  constructor(
    private router: Router,
    private configurationSvc: ConfigurationService,
    private toastrService: ToastrServiceService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.initializeTabs();
    const userDetails = localStorage.getItem('userDetails');
    this.userData = JSON.parse(userDetails ? userDetails : '');
  }

  initializeTabs() {
    this.tabs = ConfigurationTabs;
    this.selectedTab = this.tabs[0];
    this.getTableColumns();
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.isDataLoading = true;
    this.selectedTab = this.tabs[event.index];
    this.configControl.reset();
    this.getTableColumns();
  }

  getTableColumns() {
    this.tableData = [];
    switch(this.selectedTab.id) {
      case 'council': {
        this.tableColumns = this.getCouncilsTableColumns();
        this.getCouncils();
        this.descriptionOfControl = 'Add Council';
        this.lableOfControl = 'Council Name';
        break;
      }
      case 'user_type': {
        this.tableColumns = this.getUserTypesTableColumns();
        this.getUserTypes();
        this.descriptionOfControl = 'Add User Type';
        this.lableOfControl = 'User Type';
        break;
      }
      case 'department': {
        this.tableColumns = this.getDepartmentsTableColumns();
        this.getDepartments();
        this.getCouncilsList();
        this.descriptionOfControl = 'Add Grievance Department';
        this.lableOfControl = 'Department Name';
        break;
      }
      case 'escalation_time': {
        this.tableColumns = this.getEscalationTimeTableColumns();
        this.getEscalationTime();
        this.descriptionOfControl = '';
        this.lableOfControl = '';
        break;
      }
    }
    setTimeout(() => {
      this.isDataLoading = false;
    }, 100);
  }

  applyFilter(searchterms:any){
    switch(this.selectedTab.id) {
      case 'council': {
        if (searchterms) {
          const formBody = {
            "searchKeyword": searchterms
          }
          clearTimeout(this.timeoutId) 
          this.timeoutId= setTimeout(() => {
            this.getCouncilsBySearch(formBody)
          },1000); 
        } else {
          clearTimeout(this.timeoutId) 
          this.getCouncils();
        }
        break;
      }
      case 'user_type': {
        if (searchterms) {
          const formBody = {
            "searchKeyword": searchterms
          }
          clearTimeout(this.timeoutId) 
          this.timeoutId= setTimeout(() => {
            this.getUserTypesBySearch(formBody)
          },1000);  
        } else {
          clearTimeout(this.timeoutId) 
          this.getUserTypes();
        }
        break;
      }
      case 'department': {
        if (searchterms) {
          const formBody = {
            "searchKeyword": searchterms.department ? searchterms.department : '',
            "councilId": searchterms.council
          }
          clearTimeout(this.timeoutId) 
          this.getDepartmentsBySearch(formBody)
        } else {
          clearTimeout(this.timeoutId) 
          this.getDepartments();
        }
        break;
      }
    }
  }

  resetFilterValueData(event:any){
    this.tableData = [];
    clearTimeout(this.timeoutId) 
    this.getDepartments();
  }

  submit() {
    switch(this.selectedTab.id) {
      case 'council': {
        this.addNewCouncils();
        break;
      }
      case 'user_type': {
        this.addNewUserType();
        break;
      }
      case 'department': {
        this.addNewDepartment();
        break;
      }
    }
  }

  downloadDetails() {
  let fileName = '.xlsx';
  const report: any = {};
    switch(this.selectedTab.id) {
      case 'council': {
        fileName = 'councilReport' + fileName;
        report['sheetName'] = 'Counciles report';
        report['headers'] = ['S.No', 'Council Name', 'Status'];
        report['downloadObject'] = [];
        this.tableData.forEach((element: any, index: number) => {
          const reportDetails = {
            sno: index+1,
            CouncilName: element.ticketCouncilName,
            status: element.status ? 'Active' : 'Inactive'
          };
          report['downloadObject'].push(reportDetails);
        }) 
        break;
      }
      case 'user_type': {
        fileName = 'userTypesReport' + fileName;
        report['sheetName'] = 'User types';
        report['headers'] = ['S.No', 'User Type', 'Status'];
        report['downloadObject'] = [];
        this.tableData.forEach((element: any, index: number) => {
          const reportDetails = {
            sno: index+1,
            userType: element.userTypeName,
            status: element.status ? 'Active' : 'Inactive'
          };
          report['downloadObject'].push(reportDetails);
        }) 
        break;
      }
      case 'department': {
        fileName = 'deparmentsReport' + fileName;
        report['sheetName'] = 'Departments Report';
        report['headers'] = ['S.No', 'Council', 'Department', 'Status'];
        report['downloadObject'] = [];
        this.tableData.forEach((element: any, index: number) => {
          const reportDetails = {
            sno: index+1,
            CouncilName: element.ticketCouncilName,
            DepartmentName: element.ticketDepartmentName,
            status: element.status ? 'Active' : 'Inactive'
          };
          report['downloadObject'].push(reportDetails);
        }) 
        break;
      }
      case 'escalation_time': {
        fileName = 'escalationTimeReport' + fileName;
        report['sheetName'] = 'escalation Time';
        report['headers'] = ['S.No', 'Authority', 'Email', 'Days', 'Status'];
        report['downloadObject'] = [];
        this.tableData.forEach((element: any, index: number) => {
          const reportDetails = {
            sno: index+1,
            authority: element.authorityTitle,
            email: element.authorityEmails.join(', '),
            days: element.configValue,
            status: element.status ? 'Active' : 'Inactive'
          };
          report['downloadObject'].push(reportDetails);
        }) 
        break;
      }
    }

    const downloadObjects = {
      fileName: fileName,
      objectsList: [report]
    }
    exportToExcel(downloadObjects);
  }

  updateRecord(event: any) {
    switch(this.selectedTab.id) {
      case 'council': {
        this.updateCouncils(event);
        break;
      }
      case 'user_type': {
        this.updateUserTypes(event);
        break;
      }
      case 'department': {
        this.updateDepartments(event);
        break;
      }
      case 'escalation_time': {
        this.updateEscalationTime(event);
        break;
      }
    }
  }

  //#region (Councils)
  getCouncilsTableColumns() {
    const tableColumns = [
      {
        columnDef: 'ticketCouncilId',
        header: 'S.No',
        isSortable: true,
        colType: 'SerNo',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '50px'
        }
      },
      {
        columnDef: 'ticketCouncilName',
        header: 'Council Name',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['ticketCouncilName']}`
      },
      {
        columnDef: 'status',
        header: 'Action',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'slideToggle',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '100px'
        }
      },
    ]
    return tableColumns;
  }

  getCouncils() {
    this.isDataLoading = true; 
    this.tableData = [];
    if (this.apiSubscribe) {
      this.apiSubscribe.unsubscribe();
    }
    this.apiSubscribe = this.sharedService.getCouncils()
    .pipe((mergeMap((response) => {
      return of (response.responseData.sort((a: any,b: any) => {
        const result = a.ticketCouncilId - b.ticketCouncilId;
        return result * -1;
      }))
    })))
    .subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.tableData = response
      },
      error: (error) => {
        this.isDataLoading = false;
        const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
        this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    });
  }

  addNewCouncils() {
    this.isDataLoading = false;
    if (this.configControl.value) {
      this.isDataLoading = true;
      const formBody = {
        ticketCouncilName: this.configControl.value
      }
      this.configurationSvc.saveCouncil(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.configControl.reset();
            this.getCouncils();
          } else {
            this.isDataLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getCouncils();
        }
      })
    }
  }

  updateCouncils(updatedRecord: any) {
    this.isDataLoading = true;
    if (updatedRecord.columnDef === 'status') {
      const formBody = {
        ticketCouncilId: updatedRecord.row.ticketCouncilId,
        status: updatedRecord.row.status
      }
      this.configurationSvc.updateCouncilsStatus(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getCouncils();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getCouncils();
        }
      });
    } else {
      const formBody = {
        ticketCouncilId: updatedRecord.row.ticketCouncilId,
        ticketCouncilName: updatedRecord.row.ticketCouncilName
      }
      this.configurationSvc.updateCouncils(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getCouncils();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getCouncils();
        }
      });
    }
  }

  getCouncilsBySearch(formBody: any) {
    this.isDataLoading = true
    this.tableData = [];
    if (this.apiSubscribe) {
      this.apiSubscribe.unsubscribe();
    }
    this.apiSubscribe = this.configurationSvc.getCouncilsByText(formBody)
    .subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.tableData = response.responseData;
      },
      error: (error) => {
        this.isDataLoading = false;
        const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
        this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    })
  }
  //#endregion

  //#region (User Types)
  getUserTypesTableColumns() {
    const tableColumns = [
      {
        columnDef: 'userTypeId',
        header: 'S.No',
        isSortable: true,
        colType: 'SerNo',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '50px'
        }
      },
      {
        columnDef: 'userTypeName',
        header: 'User Type',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['userTypeName']}`
      },
      {
        columnDef: 'status',
        header: 'Action',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'slideToggle',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '100px'
        }
      },
    ]
    return tableColumns;
  }

  getUserTypes() {
    this.isDataLoading = true; 
    this.tableData = [];
    if (this.apiSubscribe) {
      this.apiSubscribe.unsubscribe();
    }
    this.apiSubscribe = this.sharedService.getUserTypes()
    .pipe((mergeMap((response) => {
      return of (response.responseData.sort((a: any,b: any) => {
        const result = a.userTypeId - b.userTypeId;
        return result * -1;
      }))
    })))
    .subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.tableData = response;
      },
      error: (error) => {
        this.isDataLoading = false;
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    });
  }

  addNewUserType() {
    if (this.configControl.value) {
      this.isDataLoading = true;
      const formBody = {
        userTypeName: this.configControl.value
      }
      this.configurationSvc.saveUserType(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.configControl.reset();
            this.getUserTypes();
          } else {
            this.isDataLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getUserTypes();
        }
      })
    }
  }
  
  updateUserTypes(updatedRecord: any) {
    this.isDataLoading = true;
    if (updatedRecord.columnDef === 'status') {
      const formBody = {
        userTypeId: updatedRecord.row.userTypeId,
        status: updatedRecord.row.status
      }
      this.configurationSvc.updateUserTypesStatus(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getUserTypes();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getUserTypes();
        }
      });
    } else {
      const formBody = {
        userTypeId: updatedRecord.row.userTypeId,
        userTypeName: updatedRecord.row.userTypeName
      }
      this.configurationSvc.updateUserTypes(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getUserTypes();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getUserTypes();
        }
      });
    }
  }

  getUserTypesBySearch(formBody: any) {
    if (this.apiSubscribe) {
      this.apiSubscribe.unsubscribe();
    }
    this.tableData = [];
    this.isDataLoading = true;
    this.apiSubscribe = this.configurationSvc.getUserTypesByText(formBody)
    .subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.tableData = response.responseData;
      },
      error: (error) => {
        this.isDataLoading = false;
        const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
        this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    })
  }

  //#endregion

  //#region (Department)
  getDepartmentsTableColumns() {
    const tableColumns = [
      {
        columnDef: 'ticketDepartmentId',
        header: 'S.No',
        isSortable: true,
        colType: 'SerNo',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '50px'
        }
      },
      {
        columnDef: 'ticketCouncilName',
        header: 'Council',
        isSortable: true,
        isAction: false,
        cell: (element: Record<string, any>) => `${element['ticketCouncilName']}`
      },
      {
        columnDef: 'ticketDepartmentName',
        header: 'Departments',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['ticketDepartmentName']}`
      },
      {
        columnDef: 'status',
        header: 'Action',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'slideToggle',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '100px'
        }
      },
    ]
    return tableColumns;
  }

  getCouncilsList() {
    this.sharedService.getCouncils()
    // .pipe((mergeMap((response) => {
    //   return this.formateCouncilsList(response.responseData);
    // })))
    .subscribe({
      next: (response: any) => {
        this.councilsListForFilter = response.responseData;
        this.councilControlsList = this.formateCouncilsList(response.responseData);
      },
      error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    })
  }

  formateCouncilsList(response: any) {
    const formatedCouncilsList: {
      councileName: string,
      councileId: string
    } [] = [];
    if (response) {
      response.forEach((element: any) => {
        if (element.status) {
          formatedCouncilsList.push (
            {
              councileId: element.ticketCouncilId,
              councileName: element.ticketCouncilName
            }
          )
        }
      });
    }
    return formatedCouncilsList;
  }

  getDeparmentsList(ticketCouncilId: any) {
    this.departmentsListForFilter = [];
    const conucil: any = this.councilsListForFilter.find((council: any) => council.ticketCouncilId === ticketCouncilId);
    if (conucil && conucil.ticketDepartmentDtoList) {
      this.departmentsListForFilter = conucil.ticketDepartmentDtoList.filter((department: any) => department.status);
    }
  }

  getDepartments() {
    this.isDataLoading = true; 
    this.tableData = [];
    if (this.apiSubscribe) {
      this.apiSubscribe.unsubscribe();
    }
    this.apiSubscribe = this.sharedService.getDepartments()
    .pipe((mergeMap((response) => {
      return of (response.responseData.sort((a: any,b: any) => {
        const result = a.ticketDepartmentId - b.ticketDepartmentId;
        return result * -1;
      }))
    })))
    .subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.tableData = response;
      },
      error: (error) => {
        this.isDataLoading = false;
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    });
  }

  addNewDepartment() {
    if (this.configControl.value) {
      this.isDataLoading = true;
      const formBody = {
        ticketDepartmentName: this.configControl.value,
        ticketCouncilId: this.councilControl.value
      }
      this.configurationSvc.saveDepartment(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getDepartments();
            this.configControl.reset();
            this.councilControl.reset();
          } else {
            this.isDataLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getDepartments();
        }
      })
    }
  }
  
  updateDepartments(updatedRecord: any) {
    this.isDataLoading = true;
    if (updatedRecord.columnDef === 'status') {
      const formBody = {
        ticketDepartmentId: updatedRecord.row.ticketDepartmentId,
        status: updatedRecord.row.status
      }
      this.configurationSvc.udpateDepartmentStatus(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getDepartments();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getDepartments();
        }
      });
    } else {
      const formBody = {
        ticketDepartmentId: updatedRecord.row.ticketDepartmentId,
        ticketDepartmentName: updatedRecord.row.ticketDepartmentName,
        ticketCouncilId: updatedRecord.row.ticketCouncilId
      }
      this.configurationSvc.udpateDepartment(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getDepartments();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getDepartments();
        }
      });
    }
  }

  getDepartmentsBySearch(formBody: any) {
    if (this.apiSubscribe) {
      this.apiSubscribe.unsubscribe();
    }
    this.tableData = [];
    this.isDataLoading = true;
    this.apiSubscribe = this.configurationSvc.getDepartmentsByText(formBody)
    .subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.tableData = response.responseData;
      },
      error: (error) => {
        this.isDataLoading = false;
        const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
        this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    })
  }
  //#endregion

  //#region (Escalation)
  getEscalationTimeTableColumns() {
    const tableColumns = [
      {
        columnDef: 'id',
        header: 'S.No',
        isSortable: true,
        colType: 'SerNo',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '50px'
        }
      },
      {
        columnDef: 'authorityTitle',
        header: 'Authority',
        isSortable: true,
        isAction: false,
        cell: (element: Record<string, any>) => `${element['authorityTitle']}`
      },
      {
        columnDef: 'authorityEmails',
        header: 'Email',
        isSortable: true,
        isAction: false,
        cell: (element: Record<string, any>) => `${element['authorityEmails'].join(', ')}`
      },
      {
        columnDef: 'configValue',
        header: 'Escalation days',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['configValue']}`
      },
      {
        columnDef: 'active',
        header: 'Action',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'slideToggle',
        cell: (element: Record<string, any>) => ``,
        cellStyle: {
          'width': '100px'
        }
      },
    ]
    return tableColumns;
  }

  getEscalationTime() {
    this.isDataLoading = true; 
    this.tableData = [];
    if (this.apiSubscribe) {
      this.apiSubscribe.unsubscribe();
    }
    this.apiSubscribe = this.configurationSvc.getEscalationTimes()
    .pipe((mergeMap((response) => {
      return of (response.responseData.sort((a: any,b: any) => {
        const result = a.id - b.id;
        return result * -1;
      }))
    })))
    .subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.tableData = response;
      },
      error: (error) => {
        this.isDataLoading = false;
        const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
        this.toastrService.showToastr(errorMessage, 'Error', 'error');
      }
    });
  }

  updateEscalationTime(updatedRecord: any) {
    this.isDataLoading = true;
    if (updatedRecord.columnDef !== 'active') {
      const formBody = {
        id: updatedRecord.row.id,
        configValue: updatedRecord.row.configValue,
        updatedBy: this.userData.id,
        active: updatedRecord.row.active
      }
      this.configurationSvc.updateEscalationTime(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getEscalationTime();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getEscalationTime();
        }
      });
    } else {
      const formBody = {
        id: updatedRecord.row.id,
        userId: this.userData.id,
        active: updatedRecord.row.active
      }
      this.configurationSvc.updateEscalationTimeStatus(formBody).subscribe({
        next: (response: any) => {
          if (response) {
            this.getEscalationTime();
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error.error_message ? error.error.error_message : error.error.error;
          this.toastrService.showToastr(errorMessage, 'Error', 'error');
          this.getEscalationTime();
        }
      });
    }
  }
  //#endregion

  navigateToHome() {
    this.router.navigate(['/home'])
  }

}
