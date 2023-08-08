export interface GrievancesTableData {
    id: string;
    grievanceRaiser: string;
    userType:string;
    raiserType:string;
    creationTime: string;
    escalationTime: string;
    status: string;
    isLink? : boolean;
    description?: string;
    attachedDocs?: Array<string>;
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

  }

  export interface DialogData {
    title: string;
    content: any;
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