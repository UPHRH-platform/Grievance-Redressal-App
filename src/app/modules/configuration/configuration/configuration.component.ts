import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from '../services/configuration.service';
import { BreadcrumbItem, ConfigurationTabs } from 'src/app/shared';
import { TableColumn } from 'src/app/interfaces/interfaces';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
  selectedTabIndex: any;

  tableColumns: TableColumn[] = [];
  userTypes: any = [];

  constructor(
    private router: Router,
    private configurationSvc: ConfigurationService,
    private toastrService: ToastrServiceService 
  ) {}

  ngOnInit(): void {
    this.initializeTabs()
    this.getUserTypesTableColumns()
    this.getUserTypes()
  }

  initializeTabs() {
    this.tabs = ConfigurationTabs;
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.isDataLoading = true;
    this.selectedTabIndex = event.index;
    this.getTableColumns()
  }

  getTableColumns() {
    switch(this.tabs[this.selectedTabIndex].id) {
      case 'council': {
        this.tableColumns = this.getCouncilsTableColumns();
        break;
      }
      case 'user_type': {
        this.tableColumns = this.getUserTypesTableColumns();
        break;
      }
      case 'department': {
        this.tableColumns = this.getDepartmentsTableColumns();
        break;
      }
      case 'escalation_time': {
        this.tableColumns = this.getEscalationTimeTableColumns();
        break;
      }
    }
    setTimeout(() => {
      this.isDataLoading = false;
    }, 100);
  }

  getCouncilsTableColumns() {
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
        columnDef: 'councilName',
        header: 'Council Name',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['councilName']}`
      },
      {
        columnDef: 'isActive',
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

  getUserTypesTableColumns() {
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
        columnDef: 'userType',
        header: 'User Type',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['userType']}`
      },
      {
        columnDef: 'isActive',
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

  getDepartmentsTableColumns() {
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
        columnDef: 'councilName',
        header: 'Council',
        isSortable: true,
        isAction: false,
        cell: (element: Record<string, any>) => `${element['councilName']}`
      },
      {
        columnDef: 'department',
        header: 'Departments',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['department']}`
      },
      {
        columnDef: 'isActive',
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
        columnDef: 'authority',
        header: 'Authority',
        isSortable: true,
        isAction: false,
        cell: (element: Record<string, any>) => `${element['authority']}`
      },
      {
        columnDef: 'Email ID',
        header: 'email',
        isSortable: true,
        isAction: false,
        cell: (element: Record<string, any>) => `${element['email']}`
      },
      {
        columnDef: 'escalationTime',
        header: 'Escalation days',
        isSortable: true,
        isAction: true,
        isButton: true,
        buttonType: 'editCell',
        isEdit: false,
        cell: (element: Record<string, any>) => `${element['escalationTime']}`
      },
      {
        columnDef: 'isActive',
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
    this.configurationSvc.getUserTypes().subscribe({
      next: (response) => {
        this.isDataLoading = false;
        this.userTypes = response;
      },
      error: (error) => {
        this.isDataLoading = false;
        this.toastrService.showToastr(error, 'Error', 'error');
      }
    })
  }

  updateRecord(event: any) {
    console.log('edited row', event);
  }

  navigateToHome() {
    this.router.navigate(['/home'])
  }

}
