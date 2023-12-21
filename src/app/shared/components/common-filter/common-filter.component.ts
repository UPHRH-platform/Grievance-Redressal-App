import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GrievanceServiceService } from 'src/app/modules/grievance-modules/services/grievance-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss']
})
export class CommonFilterComponent implements OnInit {
  isFilter:boolean = false;
  filterForm:FormGroup;
  filterSubscription: Subscription;
  councilId: string | undefined = undefined;
  departmentId: string | undefined = undefined;
  userTypeId: string | undefined = undefined;
  @Input() showUserType: Boolean = true;
  @Input() councilsList: any[] = [];
  @Input() departmentsList: any[] = [];
  @Input() userTypesList: any[] = [];
  @Input() isDepartmentSelect: Boolean = true;
  // @Input() startDate: any = '';
  // @Input() endDate: any = '';
  @Output() getDepearmentsOfCouncil: EventEmitter<string> = new EventEmitter<string>();
  @Output() filteredvalue: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetFilterValue: EventEmitter<any> = new EventEmitter<any>();



  constructor(
    private grievanceService: GrievanceServiceService,
    ){
    // this.filterSubscription.unsubscribe();
    this.filterForm = new FormGroup({
      // grievanceType: new FormControl('', Validators.required),
      council: new FormControl(this.councilId, Validators.required),
      department: new FormControl(this.departmentId, this.isDepartmentSelect ? [] : [Validators.required]),
      userType: new FormControl(this.userTypeId, Validators.required),
      startDate: new FormControl(''),
      endDate:new FormControl('')
    });

  }

  ngOnInit(): void {
    if(!this.filterSubscription) {
      this.filterSubscription = this.grievanceService.resetFilterValue.subscribe((data: any)=>{
         if(data){
           this.resetFilter();
           this.isFilter = false;
         }
       })
      }
      //console.log("called");
  }

  getDeparmentsList(ticketCouncilId: any) {
    this.filterForm.get('userType')?.clearValidators();
    this.filterForm.get('userType')?.updateValueAndValidity();
    this.filterForm.get('department')?.reset();
    if (!this.isDepartmentSelect) {
      this.filterForm.get('department')?.setValidators(Validators.required);
      this.filterForm.get('department')?.updateValueAndValidity();
    }
    this.getDepearmentsOfCouncil.emit(ticketCouncilId);
  }

  removeCouncilValidation() {
    this.filterForm.get('council')?.clearValidators();
    this.filterForm.get('council')?.updateValueAndValidity();
  }

  toggleFilter(){
    this.isFilter = !this.isFilter;
    if(this.isFilter === true) {
      this.filterForm.setValue({
        council: this.councilId,
        department: this.departmentId,
        userType: this.userTypeId,
        // startDate: this.startDate,
        // endDate: this.endDate
      })
    }
  }

  ApplyFilter(value:any){
    this.filteredvalue.emit(value)
    this.isFilter = !this.isFilter;
   }

  resetFilter(){
    this.filterForm.reset();
    this.resetFilterValue.emit()
  }

  ngOnDestroy() {
    //console.log("Destroyed");
  }
}


