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

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'MANAGE USERS', url: '/user-manage' },
  ];
  isDataLoading = true;
  tabs: any[] = [];
  selectedTab: any;
  descriptionOfControl = 'Add Council';
  lableOfControl = 'Council Name';
  councilControlsList = [];
  configControl = new FormControl();
  councilControl = new FormControl();
  userData: any;

  tableColumns: TableColumn[] = [];
  tableData: any = [];

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
    this.sharedService.getCouncils()
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
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
          this.getCouncils();
        }
      });
    }
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
    this.sharedService.getUserTypes()
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
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
          this.getUserTypes();
        }
      });
    }
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
    .pipe((mergeMap((response) => {
      return this.formateCouncilsList(response.responseData);
    })))
    .subscribe({
      next: (response: any) => {
        this.councilControlsList = response;
      },
      error: (error: HttpErrorResponse) => {
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
    return of(formatedCouncilsList);
  }

  getDepartments() {
    this.isDataLoading = true; 
    this.tableData = [];
    this.sharedService.getDepartments()
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
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
          this.getDepartments();
        }
      });
    }
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
        columnDef: 'Email ID',
        header: 'email',
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
    this.configurationSvc.getEscalationTimes()
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
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
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
          this.toastrService.showToastr(error.error.error, 'Error', 'error')
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
