import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
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
  @Output() EditData: EventEmitter<any>= new EventEmitter<any>();
  @Input() hasFilterOptions = true;
  @Output() rowDataDelete: EventEmitter<any>= new EventEmitter<any>();


  constructor() {}

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
     this.EditData.emit(row);
    }

    onClickDelete(e:any){
      this.rowDataDelete.emit(e)
      
    }

    

    onToggleChange(e:any){
      console.log(e)
    }
}
