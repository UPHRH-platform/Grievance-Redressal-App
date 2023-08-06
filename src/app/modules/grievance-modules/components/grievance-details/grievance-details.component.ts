import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/user-modules/services/user.service';
import { BreadcrumbItem } from 'src/app/shared';

@Component({
  selector: 'app-grievance-details',
  templateUrl: './grievance-details.component.html',
  styleUrls: ['./grievance-details.component.css'],
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
  userRole: string;
  listOfFiles: any[] = [];
  selectedOfficer: string = '';
  fileUploadError: string;
  grievancesOfficersArray = [
    'Registration NOdal Officer',
    'Affiliation NOdal Officer',
    'Hall-ticket NOdal Officer',
    'Others NOdal Officer',
  ];
  public grievanceAssignerformGroup: FormGroup;
  public grievanceResolutionForm: FormGroup;
  files: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'Grievance List', url: '/grievance/manage-tickets' },
    { label: 'Grievance Details', url: '' },
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.formData = this.router?.getCurrentNavigation()?.extras.state;
  }

  ngOnInit() {
    this.initiateData();
    this.grievanceAssignerformGroup = this.formBuilder.group({
      grievanceOfficer: new FormControl('arun@awe.com', [Validators.required]),
    });
    //assign user role
    this.userRole = this.userService.getUserRoles()[0];
    this.createForm();
  }

  createForm() {
    this.grievanceResolutionForm = this.formBuilder.group({
      description: new FormControl('', [Validators.required]),
      attachments: new FormControl('', [Validators.required])
    })
  }

  initiateData() {
    console.log(this.formData.data);
    this.listOfFiles = this.formData.data.attachedDocs;
    this.ticketId = this.formData.data.id;
    this.creationTime = this.formData.data.creationTime;
    this.escalationTime = this.formData.data.escalationTime;
    this.grievanceRaiser = this.formData.data.grievanceRaiser;
    this.grievanceType = this.formData.data.raiserType;
    this.userType = this.formData.data.userType;
    this.desc = this.formData.data.description;
  }
  grievanceOfficerSelected(e: any) {
    this.grievanceAssignerformGroup.controls['grievanceOfficer'].disable();
    this.selectedOfficer = e.value;
  }
  removeSelectedOfficer(e: any) {
    this.selectedOfficer = '';
    this.grievanceAssignerformGroup.controls['grievanceOfficer'].enable();
  }
  previewSelectedFile() {}

  handleFileUpload(event: any) {
    this.fileUploadError = '';
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];
      const extension = selectedFile.name.split('.').pop();
      const fileSize = selectedFile.size;
      const allowedExtensions = ['pdf', 'jpeg', 'png', 'docx', 'jpg'];
      if (allowedExtensions.includes(extension)) {
        // validate file size to be less than 2mb if the file has a valid extension
        if (fileSize < 2000000) {
          if (this.listOfFiles.indexOf(selectedFile?.name) === -1) {
            this.files.push(selectedFile);
            this.listOfFiles.push(
              selectedFile.name.concat(this.formatBytes(selectedFile.size))
            );
          } else {
            console.log('file already exists');
          }
        } else {
          this.fileUploadError = 'Please upload files with size less than 2MB';
        }
      } else {
        this.fileUploadError = `Please upload ${allowedExtensions.join(', ')} files`;
      }
    }
  }

  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  removeSelectedFile(index: any) {
    this.listOfFiles.splice(index, 1);
    this.files.splice(index, 1);
    if(this.files.length === 0) {
      this.grievanceResolutionForm.patchValue({
        attachments: ''
      })
    }
  }

  submitResolution(value: any) {
    console.log(value);
  }
}
