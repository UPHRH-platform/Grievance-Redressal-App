import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config/config.service';
import { GrievanceServiceService } from 'src/app/modules/grievance-modules/services/grievance-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss']
})
export class CommonFilterComponent implements OnInit {
  isFilter:boolean = false;
  grievancesTypes:any[]=[];
  filterForm:FormGroup;
  filterSubscription: Subscription;
  @Output() filteredvalue: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetFilterValue: EventEmitter<any> = new EventEmitter<any>();



  constructor(private configService: ConfigService,
    private grievanceService: GrievanceServiceService){
    // this.filterSubscription.unsubscribe();
    this.grievancesTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.filterForm = new FormGroup({
      grievanceType: new FormControl('', Validators.required),
      startDate: new FormControl(''),
      endDate:new FormControl('')
    })

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
  toggleFilter(){
    this.isFilter = !this.isFilter
  }

  ApplyFilter(value:any){
    this.filteredvalue.emit(value)
    this.isFilter = !this.isFilter;
   }

  grievanceSelected(event:any){

  }

  resetFilter(){
    this.filterForm.reset();
    this.resetFilterValue.emit()
  }

  ngOnDestroy() {
    //console.log("Destroyed");
  }
}


