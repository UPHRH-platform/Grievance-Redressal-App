export interface GrievancesTableData {
    Id: string;
    grievanceRaiser: string;
    userType:string;
    raiserType:string;
    creationTime: string;
    escalationTime: string;
    isLink? : boolean
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