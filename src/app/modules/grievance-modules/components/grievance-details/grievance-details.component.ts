import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-grievance-details',
  templateUrl: './grievance-details.component.html',
  styleUrls: ['./grievance-details.component.css']
})
export class GrievanceDetailsComponent {

  formData: any;
  ticketId: string;
  grievanceRaiser: string;
  creationTime: string;
  escalationTime: string;
  grievanceType: string;
  userType: string;
  desc: string;

  listOfFiles: [] = [];
  selectedOfficer: string = "";
  grievancesOfficersArray = [
    'Registration NOdal Officer', 'Affiliation NOdal Officer', 'Hall-ticket NOdal Officer', 'Others NOdal Officer'
  ]
  public grievanceAssignerformGroup: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder,
  ) {
    this.formData = this.router?.getCurrentNavigation()?.extras.state;

  }
  ngOnInit() {
   
    this.initiateData();
    this.grievanceAssignerformGroup = this.formBuilder.group({
      grievanceOfficer: new FormControl('arun@awe.com', [
        Validators.required]),
    });
  }
  initiateData(){
    console.log(this.formData.data)
    this.listOfFiles = this.formData.data.attachedDocs;
    this.ticketId= this.formData.data.id;
    this.creationTime= this.formData.data.creationTime;
    this.escalationTime= this.formData.data.escalationTime;
    this.grievanceRaiser= this.formData.data.grievanceRaiser;
    this.grievanceType= this.formData.data.raiserType;
    this.userType= this.formData.data.userType;
    this.desc= this.formData.data.description;

  }
  grievanceOfficerSelected(e: any) {
    this.grievanceAssignerformGroup.controls['grievanceOfficer'].disable()
    this.selectedOfficer = e.value;
  }
  removeSelectedOfficer(e: any) {
    this.selectedOfficer = ""
    this.grievanceAssignerformGroup.controls['grievanceOfficer'].enable()
  }
  previewSelectedFile() {

  }
}
