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
  }

  export interface DialogData {
    examsTableColumns: [];
    exams: [];
  }