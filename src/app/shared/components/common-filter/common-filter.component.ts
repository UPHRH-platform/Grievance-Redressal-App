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
  @Input() showUserType: Boolean = true;
  @Input() councilsList: any[] = [];
  @Input() departmentsList: any[] = [];
  @Input() userTypesList: any[] = [];
  @Input() isDepartmentSelect: Boolean = true;
  @Input() councilId: string = '';
  @Input() departmentId: string = '';
  @Input() userTypeId: string = '';
  @Input() startTime: string = '';
  @Input() endTime: string = '';
  @Input() noDepartments = false;
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
      department: new FormControl(this.departmentId, [Validators.required]),
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
    this.removeValidation('userType');
    this.filterForm.get('department')?.reset();
    // if (!this.isDepartmentSelect) {
    //   this.filterForm.get('department')?.setValidators(Validators.required);
    //   this.filterForm.get('department')?.updateValueAndValidity();
    // }
    this.getDepearmentsOfCouncil.emit(ticketCouncilId);
  }

  removeDepartmentValidation() {
    this.removeValidation('council');
    this.removeValidation('department');
  }

  removeValidation(control: string) {
    this.filterForm.get(control)?.clearValidators();
    this.filterForm.get(control)?.updateValueAndValidity();
  }

  toggleFilter(){
    this.isFilter = !this.isFilter;
    const startDate = this.startTime ? new Date(this.startTime).toString() : '';
    const endDate = this.endTime ? new Date(this.endTime).toString() : '';
    if(this.isFilter === true) {
      this.filterForm.setValue({
        council: this.councilId ? this.councilId : null,
        department: this.departmentId ? this.departmentId : null,
        userType: this.userTypeId ? this.userTypeId : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      })

      if(this.councilId !== '' && this.councilId) {
        this.removeValidation('userType');
      } else if(this.userTypeId !== '' && this.userTypeId) {
        this.removeValidation('council');
      }
    }
  }

  ApplyFilter(value:any){
    this.filteredvalue.emit(value)
    this.isFilter = !this.isFilter;
   }

  resetFilter(event? : any){
    this.filterForm.reset();
    this.resetFilterValue.emit(event)
  }

  ngOnDestroy() {
    //console.log("Destroyed");
  }
}


