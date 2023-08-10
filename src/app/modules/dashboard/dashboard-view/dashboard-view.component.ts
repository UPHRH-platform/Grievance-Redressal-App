import { Component } from '@angular/core';
import { TableColumn, DashboardTableData, DashboardAnalytics } from '../../../interfaces/interfaces';
import { BreadcrumbItem } from 'src/app/shared';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent {
  isDataLoading : boolean = false;
  dashboardData: DashboardTableData[] = [];
  dashboardDataColumns: TableColumn[] = [];
  dashboardAnalyticsData: DashboardAnalytics[] = [];
  dashboardAnalyticsColumns: TableColumn[] = [];
  dashboardAnaytics1Columns: TableColumn[] = [];
  dashboardAnalytics1Data: any[] = [];
  dashboardAnaytics2Columns: TableColumn[] = [];
  dashboardAnalytics2Data: any[] = [];
  dashboardAnalytics3Columns: TableColumn[] = [];
  dashboardAnalytics3Data: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'Dashboard', url: '/dashboard' },
  ];

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
        isLink: false,
        cell: (element: Record<string, any>) => `${element['id']}`
      },
      {
        columnDef: 'bucket',
        header: 'Bucket',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['bucket']}`
      },
      {
        columnDef: 'responsibleOfficer',
        header: 'Responsible Officer',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['responsibleOfficer']}`
      },
      {
        columnDef: 'number',
        header: 'Number',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['number']}`
      },
      {
        columnDef: 'pending',
        header: 'Pending',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['pending']}`
      },
      {
        columnDef: 'In-Process',
        header: 'inProcess',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['inProcess']}`
      },
      {
        columnDef: 'resolved',
        header: 'Resolved',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['resolved']}`
      },
      {
        columnDef: 'responseNotNeeded',
        header: 'Response not needed',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['responseNotNeeded']}`
      },
      {
        columnDef: 'duplicate',
        header: 'Duplicate',
        isSortable: true,
        isLink: false,
        cell: (element: Record<string, any>) => `${element['duplicate']}`
      }
    ];
    this.dashboardAnalyticsColumns = [
      {
        columnDef: 'status',
        header: 'Status',
        cell: (element: Record<string, any>) => `Status`
      },
      {
        columnDef: 'pending',
        header: 'Pending',
        cell: (element: Record<string, any>) => `${element['pending']}`
      },
      {
        columnDef: 'inProcess',
        header: 'In-Process',
        cell: (element: Record<string, any>) => `${element['inProcess']}`
      },
      {
        columnDef: 'Resolved',
        header: 'Resolved',
        cell: (element: Record<string, any>) => `${element['resolved']}`
      },
      {
        columnDef: 'responseNotNeeded',
        header: 'Response not needed',
        cell: (element: Record<string, any>) => `${element['responseNotNeeded']}`
      },
      {
        columnDef: 'duplicate',
        header: 'Duplicate',
        cell: (element: Record<string,any>) => `${element['duplicate']}`
      }
    ]
    this.dashboardAnaytics1Columns = [
      {
        columnDef: 'noOfIssuesResolved',
        header: '# of issues resolved',
        cell: (element: Record<string, any>) => `${element['noOfIssuesResolved']}`
      },
      {
        columnDef: 'statusNotUpdated',
        header: 'Status not updated',
        cell: (element: Record<string, any>) => `${element['statusNotUpdated']}`
      }
    ];
    this.dashboardAnaytics2Columns = [
      {
        columnDef: 'turnAroundTime',
        header: 'Turn around time',
        cell: (element: Record<string, any>) => `${element['turnAroundTime']}`
      }, 
      {
        columnDef: 'noOfGrievances',
        header: '# of Grievances',
        cell: (element: Record<string, any>) => `${element['noOfGrievances']}`
      }, 
    ]
    this.dashboardAnalytics3Columns = [
      {
        columnDef: 'avgDaysToResolve',
        header: 'Avg Days to resolve',
        cell: (element: Record<string, any>) => `${element['avgDaysToResolve']}`
      }
    ]
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
      this.dashboardAnalyticsData = [
        {
          status: '',
          pending: '0 (0%)',
          inProcess: '0 (0%)',
          resolved: '3 (100%)',
          responseNotNeeded: '0 (0%)',
          duplicate: '0 (0%)'
        },
      ];
      this.dashboardAnalytics1Data = [
        {
          noOfIssuesResolved: 184,
          statusNotUpdated: 29
        }
      ];
      this.dashboardAnalytics3Data = [
        {
          avgDaysToResolve: 49
        }
      ],
      this.dashboardAnalytics2Data = [
        {
          turnAroundTime: '<=7days',
          noOfGrievances: '56'
        },
        {
          turnAroundTime: '>7days',
          noOfGrievances: '39'
        }
      ]
      
    }
}
