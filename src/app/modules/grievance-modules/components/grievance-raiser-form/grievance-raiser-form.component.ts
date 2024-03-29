import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { SharedDialogOverlayComponent } from '../../../../shared/components/shared-dialog-overlay/shared-dialog-overlay.component';
import { MatDialog } from '@angular/material/dialog';
import { GrievanceServiceService } from '../../services/grievance-service.service';
import { ConfigService, ServerResponse } from 'src/app/shared';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { UploadService } from 'src/app/core/services/upload-service/upload.service';
import { Observable, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-grievance-raiser-form',
  templateUrl: './grievance-raiser-form.component.html',
  styleUrls: ['./grievance-raiser-form.component.scss']
})


export class GrievanceRaiserFormComponent {

  @ViewChild('attachments') attachment: any;

  listOfFiles: any[] = [];
  isLoading = false;
  submitted = false;
  files: File[] = [];
  fileUploadError: string;
  ticketDetails: any = {};
  grievancesTypes: any[] = [];
  userTypesArray = [
    'Candidate', 'Institute', 'Faculty', 'Others'
  ];
  public grievanceRaiserformGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private grievanceService: GrievanceServiceService,
    private configService: ConfigService,
    private toastrService: ToastrServiceService,
    private uploadService: UploadService,
    ) { 
      this.grievancesTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    }

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    this.grievanceRaiserformGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern("^(0|91)?[6-9][0-9]{9}$")]),
      grievanceType: new FormControl('', [
        Validators.required]),
      userType: new FormControl('', [
        Validators.required]),
      attachmentUrls: new FormControl('', ),
      description: new FormControl('', [Validators.required]),

    });
  }

  getError(el: any) {
    switch (el) {
      case 'name':
        if (this.grievanceRaiserformGroup.get('name')?.hasError('required')) {
          return 'Name is required !!';
        }
        break;
      case 'email':
        if (this.grievanceRaiserformGroup.get('email')?.hasError('required')) {
          return 'Email is required !!';
        }
        break;
      case 'phone':
        if (this.grievanceRaiserformGroup.get('phone')?.hasError('required')) {
          return 'Mobile number is required !!';
        }
        break;
      case 'userType':
        if (this.grievanceRaiserformGroup.get('userType')?.hasError('required')) {
          return 'User type is required !!';
        }
        break;
      default:
        return '';
    }
    return
  }

  onReset() {
    this.submitted = false;
    this.grievanceRaiserformGroup.reset();
    this.listOfFiles = [];
    this.files= [];
    this.ticketDetails= {};
  }



  handleFileUpload(event: any) {
    this.fileUploadError = '';
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];
      const extension = selectedFile.name.split('.').pop();
      const fileSize = selectedFile.size;
      const allowedExtensions = ['pdf', 'jpeg', 'jpg', 'png', 'docx'];
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
    console.log("Files info", this.listOfFiles);
    console.log("Files info", this.files);

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
  }


  openSharedDialog(otpSubmitted: boolean): void {
    const {name, email, phone, id} = this.ticketDetails;
    let dialogData: any = {
      otpSubmitted,
      name,
      email,
      phone
    }
    if(otpSubmitted){
      dialogData.ticketId = id;
    }
    const dialogRef = this.dialog.open(SharedDialogOverlayComponent, {
      data: dialogData,
      maxWidth: '400vw',
      maxHeight: '100vh',
      height: '55%',
      width: '40%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(!!result) {
        if(result === 'close_success')  {
          this.onReset();
        }else  {
          this.createTicket(result);
        } 
      }
    });
  }

  onSubmit(value: any) {
    console.log(value)
    const {name, email, phone, grievanceType, userType, description } =  value;
    const firstName= name.split(" ")[0];
    const lastName= name.split(" ")[1];
    this.ticketDetails = {
      name,
      firstName,
      lastName: !!lastName  ? lastName : "",
      email,
      phone,
      cc: grievanceType,
      userType: userType?.toUpperCase(),
      description,
      attachmentUrls: []
    }
    this.openSharedDialog(false); 
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

  // createTicket(otpDetails: any) {
  //   this.submitted = true;
  //   const ticketDetails = {...this.ticketDetails, otp: otpDetails?.mobileOTP};
  //   delete ticketDetails.name;
  //   this.grievanceService.createTicket(ticketDetails).subscribe({
  //     next: (res) => {
  //       this.toastrService.showToastr("Grievance ticket is created successfully!", 'Success', 'success', '');
  //       this.submitted= false;
  //       this.ticketDetails.id= res.responseData.id;
  //       this.openSharedDialog(true);
  //    },
  //    error: (err) => {
  //     this.toastrService.showToastr(err, 'Error', 'error', '');
  //     this.submitted= false;
  //      // Handle the error here in case of login failure
  //    }
  //   });  
  // }

  createTicket(otpDetails: any) {
    this.submitted = true;
    const ticketDetails = { ...this.ticketDetails, otp: otpDetails?.mobileOTP };
    delete ticketDetails.name;
  
    // Call uploadFiles to upload attachments
    this.uploadFiles().pipe(
      switchMap((uploadResponses) => {
        // Extract attachmentUrls from uploadResponses
        const attachmentUrls = uploadResponses.map((response: any) => response.responseData.fileUrl);
  
        // Add attachmentUrls to ticketDetails
        ticketDetails.attachmentUrls = attachmentUrls;
  
        // Call the createTicket API with updated ticketDetails
        return this.grievanceService.createTicket(ticketDetails);
      })
    ).subscribe({
      next: (res) => {
        this.toastrService.showToastr("Grievance ticket is created successfully!", 'Success', 'success', '');
        this.submitted = false;
        this.ticketDetails.id = res.responseData.id;
        this.openSharedDialog(true);
      },
      error: (err) => {
        this.toastrService.showToastr(err, 'Error', 'error', '');
        this.submitted = false;
        // Handle the error here in case of file upload or ticket creation failure
      }
    });
  }
}
