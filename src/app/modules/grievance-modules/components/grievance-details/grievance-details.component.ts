import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core';
import { BreadcrumbItem, ConfigService, ServerResponse } from 'src/app/shared';
import { GrievanceServiceService } from '../../services/grievance-service.service';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { Observable, forkJoin, mergeMap, of, switchMap } from 'rxjs';
import { UploadService } from 'src/app/core/services/upload-service/upload.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedDescriptionDialogComponent } from 'src/app/shared/components/shared-description-dialog/shared-description-dialog.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-grievance-details',
  templateUrl: './grievance-details.component.html',
  styleUrls: ['./grievance-details.component.css'],
})
export class GrievanceDetailsComponent {
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
  public assignGrievanceTypeForm:FormGroup;
  files: any[] = [];
  id: string;
  userId:string;
  breadcrumbItems: BreadcrumbItem[] = [];
  currentTabName: string = '';
  ticketDetails: any = {};
  ticketIdNo: any;
  ticketUpdateRequest:any;
  councilsList = [];
  departmentsList = [];
  usersList: any[] = [];
  departmentsEmpty = false;
  usersEmpty = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService,
    private grievanceServiceService: GrievanceServiceService, private route: ActivatedRoute,
    private toastrService: ToastrServiceService, private configService:ConfigService, private uploadService: UploadService,
    private dialog: MatDialog, private sharedService: SharedService) {
    this.route.params.subscribe((param) => {
      this.id = param['id'];
    })
  }

  ngOnInit() {
    this.getTicketById();
    this.grievanceAssignerformGroup = this.formBuilder.group({
      grievanceOfficer: new FormControl('arun@awe.com', [Validators.required]),
    });
    //assign user role
    this.userRole = this.authService.getUserRoles()[0];
    if(this.userRole === 'Grievance Nodal') {
    }
    //console.log(this.userRole)
    this.userId = this.authService.getUserData().userRepresentation.id;
    this.createForm();
    this.createAssignForm();
    this.route.queryParams.subscribe((data)=>{
      this.currentTabName = data['tabName']
      this.breadcrumbItems = [
        { label: 'Grievance Management', url: '/home' },
        { label: 'Grievance List', url: ['/grievance/manage-tickets'], queryParams:  {tabName: this.currentTabName} },
        { label: 'Grievance Details', url: '' },
      ];
    })
    this.getCouncils()
  }

  getCouncils() {
    this.sharedService.getCouncils()
    .pipe((mergeMap((response) => {
      const counciles = response.responseData
      .filter((council: any) => council.status && !council.ticketCouncilName.toLowerCase().includes('other'));
      return of(counciles)
    })))
    .subscribe({
      next: (response) => {
        this.councilsList = response
      },
      error: (error) => {
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
      }
    });
  }

  getDeparmentsList(ticketCouncilId: any) {
    this.departmentsList = [];
    this.assignGrievanceTypeForm.get('department')?.reset();
    const conucil: any = this.councilsList.find((council: any) => council.ticketCouncilId === ticketCouncilId);
    if (conucil && conucil.ticketDepartmentDtoList) {
      this.departmentsList = conucil.ticketDepartmentDtoList.filter((department: any) => department.status);
      if (this.departmentsList.length === 0) {
        this.departmentsEmpty = true;
        this.assignGrievanceTypeForm.get('department')?.markAsTouched()
      }
    }
  }

  getUsers() {
    if (this.assignGrievanceTypeForm.get('council')?.value && this.assignGrievanceTypeForm.get('department')?.value) {
      this.usersList = [];
      this.assignGrievanceTypeForm.get('user')?.reset();
      this.sharedService.getUsersByCouncilDetapartmen(this.assignGrievanceTypeForm.get('council')?.value, this.assignGrievanceTypeForm.get('department')?.value)
      .subscribe({
        next: (response: any) => {
          if (response && response.responseData && response.responseData.length > 0) {
            this.usersList = response.responseData;
          } else {
            this.usersEmpty = true;
            this.assignGrievanceTypeForm.get('user')?.markAsTouched()
          }
        },
        error: (error: HttpErrorResponse) => {
          const errMessage = error.error.errMessage ? error.error.errMessage : error.error.error;
          this.toastrService.showToastr(errMessage, 'Error', 'error');
        }
      })
    }
  }

  navigateToHome(){
    this.router.navigate(['/grievance/manage-tickets'], {queryParams:  {tabName: this.currentTabName}})
  }

  createForm() {
    this.grievanceResolutionForm = this.formBuilder.group({
      description: new FormControl('', [Validators.required]),
      attachments: new FormControl([])
    })
  }

  grievanceSelected(grievance: Event) {
    //console.log(grievance)
  }

  createAssignForm(){
    this.assignGrievanceTypeForm = this.formBuilder.group({
      council: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      user: new FormControl('', Validators.required)
    })
  }

  grievanceOfficerSelected(e: any) {
    this.grievanceAssignerformGroup.controls['grievanceOfficer'].disable();
    this.selectedOfficer = e.value;
  }
  removeSelectedOfficer(e: any) {
    this.selectedOfficer = '';
    this.grievanceAssignerformGroup.controls['grievanceOfficer'].enable();
  }
  previewSelectedFile() { }

  handleFileUpload(event: any) {
    this.fileUploadError = '';
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];
      const extension = selectedFile.name.split('.').pop();
      const fileSize = selectedFile.size;
      const allowedExtensions = ['pdf', 'jpeg', 'jpg', 'png'];
      if (allowedExtensions.includes(extension)) {
        // validate file size to be less than 5mb if the file has a valid extension
        if (fileSize < 5000000) {
          if (this.listOfFiles.indexOf(selectedFile?.name) === -1) {
            this.files.push(selectedFile);
            this.listOfFiles.push(
              selectedFile.name.concat(this.formatBytes(selectedFile.size))
            );
          } else {
            //console.log('file already exists');
          }
        } else {
          this.fileUploadError = 'Please upload files with size less than 5MB';
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
    if (this.files.length === 0) {
      this.grievanceResolutionForm.patchValue({
        attachments: []
      })
    }
  }

  uploadFiles() {
    if (this.files.length === 0) {
      // Return an observable that emits an empty array
      return of([]);
    }
    let uploadFileRequests :Observable<ServerResponse>[] =[];
    this.files.forEach((file) => {
      const formData: FormData = new FormData();
      formData.append('file', file); 
      uploadFileRequests.push(this.uploadService.uploadFile(formData));
    });
    return forkJoin(uploadFileRequests);
  }

  submitResolution() {
    const fileUploadUrlResponses: any = [];
    this.uploadFiles().pipe(
      switchMap((uploadResponses) => {
        console.log("uploadResponses", uploadResponses);
        // Extract attachmentUrls from uploadResponses
        uploadResponses.map((obj: any,index) => {
          fileUploadUrlResponses.push(obj.responseData.result.url);
        })
        console.log(fileUploadUrlResponses);
        const request = {
          ...this.ticketUpdateRequest,
          assigneeAttachmentURLs: fileUploadUrlResponses
        }
        //console.log(request);
        // Call the createTicket API with updated ticketDetails
        return this.grievanceServiceService.updateTicket(request);
      })
    ).subscribe({
      next: (res) => {
        this.toastrService.showToastr("Ticket marked as resolved", 'Success', 'success', '');
        this.getTicketById();
        this.router.navigate(['/grievance/manage-tickets/'],{ queryParams: {tabName: this.currentTabName}});
      },
      error: (err) => {
        this.toastrService.showToastr(err, 'Error', 'error', '');
        // Handle the error here in case of file upload or ticket creation failure
      }
    });
  }

  getTicketById() {
    this.ticketDetails = {};
    this.grievanceServiceService.getTicketsById(this.id).subscribe({
      next: (res) => {
        //console.log(res.responseData);
        this.ticketDetails = res.responseData;
          this.configService.dropDownConfig.GRIEVANCE_TYPES.map((grievance: any) => {
            if(this.ticketDetails.assignedToId == grievance.id) {
              this.ticketDetails.assignedToName = grievance.name;
            }
          })
      },
      error: (err) => {
        // Handle the error here in case of Api failure
        this.toastrService.showToastr(err, 'Error', 'error', '');
      }
    })
  }

  handleClick(params:any, data?:any) {
    //console.log('data.value',data)
  // const {attachments, description} = value
    this.ticketUpdateRequest = {
      requestedBy: this.userId,
      cc: this.ticketDetails.assignedToId,
      status: this.ticketDetails.status,
      priority: this.ticketDetails.priority,
      id:this.id
    }
    switch(params) {
      case 'markjunk': 
        this.ticketUpdateRequest = {
          ...this.ticketUpdateRequest,
          isJunk:true,
          status:'INVALID',
        }
        const junkDialogData = {
          header: 'Describe reason to mark Junk',
          params: params,
          controls: [{
              controlLable: 'Enter reason',
              controlName: 'reason',
              controlType: 'textArea',
              placeholder: 'Type here',
              value: '',
              validators: ['required']
            },
          ],
          buttons: [
            {
              btnText: 'Submit',
              positionClass: 'right',
              btnClass: '',
              type: 'submit'
            },
            {
              btnText: 'Cancel',
              positionClass: 'right',
              btnClass: 'mr2',
              type: 'close'
            },
          ],
        }
        this.openDescriptionPopup(junkDialogData);
        return ;
      case 'reopen': 
      this.ticketUpdateRequest = {
        ...this.ticketUpdateRequest,
        status: "OPEN",
        isJunk: false
      }
      break;
      // this is failing
      case 'nudge': 
      this.ticketUpdateRequest = {
        ...this.ticketUpdateRequest,
        priority: "HIGH",
        isNudged: true,
      }
      break;
      case 'markothers': 
      this.ticketUpdateRequest = {
        ...this.ticketUpdateRequest,
        "cc":-1,
        isJunk: this.ticketDetails.junk,
      }
      const otherDialogData = {
        header: 'Describe reason to mark Other',
        params: params,
        controls: [{
            controlLable: 'Enter reason',
            controlName: 'reason',
            controlType: 'textArea',
            placeholder: 'Type here',
            value: '',
            validators: ['required']
          },
        ],
        buttons: [
          {
            btnText: 'Submit',
            positionClass: 'right',
            btnClass: '',
            type: 'submit'
          },
          {
            btnText: 'Cancel',
            positionClass: 'right',
            btnClass: 'mr2',
            type: 'close'
          },
        ],
      }
      this.openDescriptionPopup(otherDialogData);
      return ;
      case 'unjunk': 
      this.ticketUpdateRequest = {
        ...this.ticketUpdateRequest,
        "isJunk": false,
        status:"OPEN"
      }
      break;
      case 'resolved': 
      this.ticketUpdateRequest = {
        ...this.ticketUpdateRequest,
        comment: data.description,
        status:"CLOSED",
        isJunk: this.ticketDetails.junk,
      }
      break;
      case 'assign': 
      this.ticketUpdateRequest = {
        ...this.ticketUpdateRequest,
       cc: this.assignGrievanceTypeForm.get('user')?.value,
      ticketCouncilId: this.assignGrievanceTypeForm.get('council')?.value,
      ticketDepartmentId: this.assignGrievanceTypeForm.get('department')?.value,
       isJunk: this.ticketDetails.junk,
      }
      break;
      default: 
      this.ticketUpdateRequest = {
        ...this.ticketUpdateRequest,
        isJunk: this.ticketDetails.junk,
      }
      break;
    }
    if(params === 'resolved') {
      this.submitResolution();
    }
    else {
      this.updateTicketDetails();
    }
  }

  openDescriptionPopup(dialogDetails: any) {
    const dialogRef = this.dialog.open(SharedDescriptionDialogComponent, {
      data: dialogDetails,
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        if(dialogDetails.params === 'markjunk') {
          this.ticketUpdateRequest['junkByReason'] = response.form.reason;
          this.ticketUpdateRequest['isJunk'] = true;
        } else if(dialogDetails.params === 'markothers') {
          this.ticketUpdateRequest['otherByReason'] = response.form.reason;
          this.ticketUpdateRequest['isOther'] = true;
        }
        if(dialogDetails.params === 'resolved') {
          this.submitResolution();
        }
        else {
          this.updateTicketDetails();
        }
      }
    })
  }

  updateTicketDetails() {
    //console.log('this.ticketUpdateRequest',this.ticketUpdateRequest)
    this.grievanceServiceService.updateTicket(this.ticketUpdateRequest).subscribe({
      next: (res) =>{
        this.getTicketById();
        this.toastrService.showToastr("Ticket updated successfully!", 'Success', 'success', '');
        this.router.navigate(['/grievance/manage-tickets/'],{ queryParams: {tabName: this.currentTabName}});
      },error: (err) =>{
        this.toastrService.showToastr(err, 'Error', 'error', '');
      }
    });
  }
}
