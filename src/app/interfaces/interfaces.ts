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
    examsTableColumns: [];
    exams: [];
  }

  export interface userTableData {
    fullName:string,
    email:string,
    phoneNumber:number,
    role:string,
    accountStatus:string,
    isMenuOption?:boolean
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
    duplicate: string
  }