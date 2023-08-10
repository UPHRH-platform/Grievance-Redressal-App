import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { ConfigService, getRole } from '../..';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core';
export interface TableProps {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}


/* interface Column {
  field: string;
  header: string;
} */

export interface TableColumn {
  columnDef: string;
  header: string;
  cell: Function;
  isLink?: boolean;
  isAction?: boolean;
  url?: string;
  isSortable?: boolean;
}

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent implements AfterViewInit {

  value!: TableProps[];

  cols!: TableColumn[];

  displayedColumns: Array<string> = [];
  isFilter:boolean = false;
  grievancesTypes: any[] = [];
  userRole:string;
  filterForm:FormGroup;
  isClient:boolean = false;
  accumulatedSearchTerm:string = '';
  //dataSource: MatTableDataSource<[any]> = new MatTableDataSource();
  public dataSource = new MatTableDataSource([]);
 // dataSource = new MatTableDataSource([])
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort ;

  @Input() isPageable = true;
  @Input() tableColumns: TableColumn[] ;
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }
  @Input() pageLength: number;
  @Input() pageSize: number;
  @Input() pageIndex: number;
  @Input() isServerSidePagination: boolean;

  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() editData: EventEmitter<any>= new EventEmitter<any>();
  @Input() hasFilterOptions = true;
  @Output() toggleData: EventEmitter<any>= new EventEmitter<any>();
  @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchParmas: EventEmitter<any> = new EventEmitter<any>();
  pageEvent: PageEvent;
  private timeoutId: any;


  constructor( private configService: ConfigService,
    private authService: AuthService) {
    this.grievancesTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.filterForm = new FormGroup({
      grievanceType: new FormControl('',Validators.required),
      startDate: new FormControl(''),
      endDate:new FormControl('')
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns?.map((tableColumn:any) => tableColumn.columnDef);
    this.userRole = this.authService.getUserRoles()[0];
  }

    applyFilter(filterValue: string) {
      if(this.isClient){
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
      else {
        clearTimeout(this.timeoutId)

        this.accumulatedSearchTerm  = filterValue
         this.timeoutId= setTimeout(()=>{
          this.searchParmas.emit(this.accumulatedSearchTerm)
        },1000
        )  
      }
      
    }

    toggleFilter(){
    this.isFilter = !this.isFilter
    }

    onRowClick(e: Event){
      console.log(e);
    }

    setTableDataSource(data : any) {
     
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    emitRowAction(row: any) {
      this.rowAction.emit(row);
    }

    onClickEdit(row:any){
     this.editData.emit(row);
    }

    onClickDelete(e:any){
      
    }

    onToggleChange(e:any){
      this.toggleData.emit(e);
    }
    getUserRole(roleName: string) {
      return getRole(roleName);
     }

    handlePageEvent(e: PageEvent) {
      this.pageChange.emit(e);
    }

     grievanceSelected(e:any){
     }
     ApplyFilter(value:any){
      console.log(value)
     }
}
