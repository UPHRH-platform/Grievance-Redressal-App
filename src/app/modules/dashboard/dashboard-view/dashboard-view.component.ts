import { Component } from '@angular/core';
import { TableColumn, DashboardTableData } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent {
  isDataLoading : boolean = false;
  dashboardData: DashboardTableData[] = [];
  dashboardDataColumns: TableColumn[] = [];
  constructor() {}

  ngOnInit(): void {
    this.initializeColumns();
    this.getDashboardData();
  }

  initializeColumns(): void {
    this.dashboardDataColumns = [
      {
        columnDef: 'id',
        header: '#',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['id']}`
      },
      {
        columnDef: 'bucket',
        header: 'Bucket',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['bucket']}`
      },
      {
        columnDef: 'responsibleOfficer',
        header: 'Responsible Officer',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['responsibleOfficer']}`
      },
      {
        columnDef: 'number',
        header: 'Number',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['number']}`
      },
      {
        columnDef: 'pending',
        header: 'Pending',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['pending']}`
      },
      {
        columnDef: 'In-Process',
        header: 'inProcess',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['inProcess']}`
      },
      {
        columnDef: 'resolved',
        header: 'Resolved',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['resolved']}`
      },
      {
        columnDef: 'responseNotNeeded',
        header: 'Response not needed',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['responseNotNeeded']}`
      },
      {
        columnDef: 'duplicate',
        header: 'Duplicate',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['duplicate']}`
      }
    ];
  }

  getDashboardData() {
      this.isDataLoading = true;
      setTimeout(() => {
        this.isDataLoading = false;
      }, 2000);
      this.dashboardData = [
        {
          id: "1",
          bucket: 'Affiliation',
          responsibleOfficer: 'Art of living',
          number: '3 (2%)',
          pending: '0 (0%)',
          inProcess: '0 (0%)',
          resolved: '3 (100%)',
          responseNotNeeded: '0 (0%)',
          duplicate: '0 (0%)'

        },
        {
          id: "2",
          bucket: 'Biometric Attendance',
          responsibleOfficer: 'Microsoft',
          number: '102 (55%)',
          pending: '1 (1%)',
          inProcess: '0 (0%)',
          resolved: '60 (59%)',
          responseNotNeeded: '2 (2%)',
          duplicate: '10 (10%)'
        },
        {
          id: "3",
          bucket: 'Enrollment',
          responsibleOfficer: 'ISTM',
          number: '25 (14%)',
          pending: '0 (0%)',
          inProcess: '1 (4%)',
          resolved: '24 (96%)',
          responseNotNeeded: '0 (0%)',
          duplicate: '0 (0%)'
        },        
      ];
      
    }
}
