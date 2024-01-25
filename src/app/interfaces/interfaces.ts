export interface GrievancesTableData {
    id: string,
    ticketId: number,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    requesterType: string,
    assignedToId: any,
    assignedToName: string,
    description: string,
    junk: boolean,
    createdDate: string,
    updatedDate: string,
    createdDateTS: number,
    updatedDateTS: number,
    lastUpdatedBy: number,
    escalated: boolean,
    escalatedDate: string,
    escalatedDateTS: number,
    escalatedTo: number,
    status: string,
    requestType: any,
    priority: string,
    escalatedBy: number
}
  export interface TableColumn {
    columnDef: string;
    header: string;
    cell: Function;
    isLink?: boolean;
    isAction?: boolean;
    url?: string;
    isSortable?: boolean;
    isMenuOption?:boolean;
    isButton?: boolean;
    buttonType?: string;
    cellStyle?: any
    isEdit?: boolean;
    colType?: string;

  }

  export interface DialogData {
    title: string;
    content: any;
    otpSubmitted?: boolean;
    name?: string;
    email?: string;
    phone?: string;
    ticketId?: number;
    processedBtnText?: string;
    cancelBtnText?: string;
  }

  export interface userTableData {
    id: number,
    name:string,
    username:string,
    phone:number,
    role:string,
    status:string,
    isMenuOption?:boolean,
    isActive?: boolean,
    roles?: any
  }

  export interface DashboardTableData {
    id: string,
    bucket: string,
    responsibleOfficer: string,
    number: string,
    pending: string,
    inProcess: string,
    resolved: string,
    responseNotNeeded: string,
    duplicate: string,
  }

  export interface DashboardAnalytics {
    status: ''
    pending: string,
    inProcess: string,
    resolved: string,
    responseNotNeeded: string,
    duplicate: string
  }