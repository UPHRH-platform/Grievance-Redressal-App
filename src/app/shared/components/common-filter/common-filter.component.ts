import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GrievanceServiceService } from 'src/app/modules/grievance-modules/services/grievance-service.service';
import { Subscription } from 'rxjs';
import { getRole } from '../../util';

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
  @Input() rolesList: any[] = [];
  @Input() isManagement: Boolean = false;
  @Input() councilId: string = '';
  @Input() departmentId: string = '';
  @Input() userTypeId: string = '';
  @Input() startTime: string = '';
  @Input() endTime: string = '';
  @Input() rating: number | null = null;
  @Input() noDepartments = false;
  @Input() showRating = false;
  @Input() showRoles = false;
  @Input() roleID = '';
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
      // department: new FormControl(this.departmentId, this.isManagement ? [] : [Validators.required]),
      department : new FormControl(this.departmentId),
      userType: new FormControl(this.userTypeId, Validators.required),
      startDate: new FormControl(''),
      endDate:new FormControl(''),
      rating: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
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
    this.removeValidation('rating');
    this.removeValidation('role');
    this.addValidation('council');
    this.filterForm.get('department')?.reset();
    // if (!this.isManagement) {
    //   this.filterForm.get('department')?.setValidators(Validators.required);
    //   this.filterForm.get('department')?.updateValueAndValidity();
    // }
    this.getDepearmentsOfCouncil.emit(ticketCouncilId);
  }

  removeDepartmentValidation() {
    this.removeValidation('council');
    this.removeValidation('department');
    this.removeValidation('rating');
    this.removeValidation('role');
    this.addValidation('userType');
  }

  addRatingValidation() {
    this.removeValidation('council');
    this.removeValidation('department');
    this.removeValidation('userType');
    this.removeValidation('role');
    this.addValidation('rating');
  }

  getUserRole(roleName: string) {
    return getRole(roleName);
   }

  roleSelected(value: string) {
    this.removeValidation('council');
    this.removeValidation('department');
    this.removeValidation('userType');
    this.removeValidation('rating');
    this.addValidation('role');
    if(value !== 'NODALOFFICER') {
      this.filterForm.reset()
      this.departmentsList = [];
      this.filterForm.get('role')?.patchValue(value);
      this.filterForm.get('council')?.disable();
      this.filterForm.get('department')?.disable();
    } else {
      this.filterForm.get('council')?.enable();
      this.filterForm.get('department')?.enable();
    }
  }

  removeValidation(control: string) {
    this.filterForm.get(control)?.clearValidators();
    this.filterForm.get(control)?.updateValueAndValidity();
  }
  

  addValidation(control: string) {
    this.filterForm.get(control)?.addValidators(Validators.required);
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
        endDate: new Date(endDate),
        rating: this.rating ? this.rating : '',
        role: this.roleID ? this.roleID : ''

      })

      if(this.councilId !== '' && this.councilId) {
        this.removeValidation('userType');
        this.removeValidation('rating');
        this.removeValidation('role');
        this.addValidation('council');
      } 
      if(this.userTypeId !== '' && this.userTypeId) {
        this.removeValidation('council');
        this.removeValidation('rating');
        this.removeValidation('role');
        this.addValidation('userType');
      }
      if(this.rating) {
        this.removeValidation('council');
        this.removeValidation('userType');
        this.removeValidation('role');
        this.addValidation('rating');
      }
      if(this.roleID) {
        this.removeValidation('council');
        this.removeValidation('userType');
        this.removeValidation('rating');
        this.addValidation('role');
        if(this.roleID !== 'NODALOFFICER') {
          this.filterForm.get('council')?.disable();
          this.filterForm.get('department')?.disable();
        }
      }
    }
  }

  ApplyFilter(value:any){
    if (this.isManagement) {
      const filterForm = {
        council: this.councilsList.find((council) => council.ticketCouncilId === value.council),
        department: this.departmentsList.find((department) => department.ticketDepartmentId === value.department)
      }
      this.filteredvalue.emit(filterForm);
    } else {
      this.filteredvalue.emit(value);
    }
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


