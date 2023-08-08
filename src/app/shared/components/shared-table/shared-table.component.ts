import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { ConfigService, getRole } from '../..';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  filterForm:FormGroup
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


  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() editData: EventEmitter<any>= new EventEmitter<any>();
  @Input() hasFilterOptions = true;
  @Output() toggleData: EventEmitter<any>= new EventEmitter<any>();


  constructor( private configService: ConfigService) {
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
  }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log(this.dataSource.filter);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
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

     grievanceSelected(e:any){
     }
     ApplyFilter(value:any){
      console.log(value)
     }
}
