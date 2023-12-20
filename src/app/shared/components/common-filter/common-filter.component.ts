import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() showUserType: Boolean = true;
  @Input() councilsList: any[] = [];
  @Input() departmentsList: any[] = [];
  @Input() userTypesList: any[] = [];
  @Output() getDepearmentsOfCouncil: EventEmitter<string> = new EventEmitter<string>();
  @Output() filteredvalue: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetFilterValue: EventEmitter<any> = new EventEmitter<any>();



  constructor(
    private grievanceService: GrievanceServiceService,
    ){
    // this.filterSubscription.unsubscribe();
    this.filterForm = new FormGroup({
      // grievanceType: new FormControl('', Validators.required),
      council: new FormControl('', Validators.required),
      department: new FormControl(''),
      userType: new FormControl('', Validators.required),
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
    this.getDepearmentsOfCouncil.emit(ticketCouncilId);
  }

  removeCouncilValidation() {
    this.filterForm.get('council')?.clearValidators();
    this.filterForm.get('council')?.updateValueAndValidity();
  }

  toggleFilter(){
    this.isFilter = !this.isFilter
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


