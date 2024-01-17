import { Component, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { SharedDialogOverlayComponent } from '../../../../shared/components/shared-dialog-overlay/shared-dialog-overlay.component';
import { MatDialog } from '@angular/material/dialog';
import { GrievanceServiceService } from '../../services/grievance-service.service';
import { ConfigService, ServerResponse } from 'src/app/shared';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { UploadService } from 'src/app/core/services/upload-service/upload.service';
import { Observable, forkJoin, mergeMap, of, switchMap } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  innerHeight: any;
  innerWidth: any;
  userTypesArray = [];
  councilsList = [];
  departmentsList = [];
  departmentsEmpty = false;
  dialogSettings = {
    maxHeight: '100vh',
    height: 'auto',
    disableClose: true
  }
  public grievanceRaiserformGroup: FormGroup | undefined = undefined;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private grievanceService: GrievanceServiceService,
    private toastrService: ToastrServiceService,
    private uploadService: UploadService,
    private sharedService: SharedService,
    ) { 
    }
    

  ngOnInit() {
    this.grievanceRaiserformGroup = this.createForm();
    this.getDropDownsList();
  }

  getDropDownsList() {
    this.getUserTypes();
    this.getCouncils();
  }

  getUserTypes() {
    this.sharedService.getUserTypes()
    .pipe((mergeMap((response) => {
      const userTypes = response.responseData.filter((userType: any) => userType.status);
      return of(userTypes);
    })))
    .subscribe({
      next: (response) => {
        this.userTypesArray = response;
      },
      error: (error) => {
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
      }
    });
  }

  getCouncils() {
    this.sharedService.getCouncils()
    .pipe((mergeMap((response) => {
      const counciles = response.responseData.filter((council: any) => council.status && council.ticketDepartmentDtoList);
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
    this.grievanceRaiserformGroup!.get('department')?.reset();
    this.departmentsEmpty = false;
    this.sharedService.getUserAssignedDepartment(ticketCouncilId)
    .subscribe({
      next: (response: any) => {
        this.departmentsList = response.responseData;
        if (this.departmentsList.length === 0) {
          this.departmentsEmpty = true;
          this.grievanceRaiserformGroup!.get('department')?.markAsTouched()
        }
      },
      error: (error: HttpErrorResponse) => {
        const error_message = error.error.error_message ? error.error.error_message : error.error.error;
        this.toastrService.showToastr(error_message, 'Error', 'error');
      }
    });
  }

  createForm(): FormGroup {
    const formGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required, Validators.pattern("^[a-zA-Z ]*$")]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(`^[0-9]*$`),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      userType: new FormControl('', [
        Validators.required]),
      council: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      attachmentUrls: new FormControl('', ),
      description: new FormControl('', [Validators.required]),

    });
    return formGroup
  }

  getError(el: any) {
    switch (el) {
      case 'name':
        if (this.grievanceRaiserformGroup?.get('name')?.hasError('required')) {
          return 'Name is required';
        }
        if (this.grievanceRaiserformGroup?.get('name')?.hasError('pattern')) {
          return 'Should contain characters between a-z/A-z only';
        }
        break;
      case 'email':
        if (this.grievanceRaiserformGroup?.get('email')?.hasError('required')) {
          return 'Email is required';
        }
        if(this.grievanceRaiserformGroup?.get('email')?.hasError('pattern')) {
          return 'Enter a valid Email ID';
        }
        break;
      case 'phone':
        if (this.grievanceRaiserformGroup?.get('phone')?.hasError('required')) {
          return 'Mobile number is required';
        }
        if (this.grievanceRaiserformGroup?.get('phone')?.hasError('pattern')) {
          return 'Mobile number should contain 10 digits only';
        }
        break;
      case 'userType':
        if (this.grievanceRaiserformGroup?.get('userType')?.hasError('required')) {
          return 'User type is required';
        }
        break;
      case 'council':
        if (this.grievanceRaiserformGroup?.get('council')?.hasError('required')) {
          return 'Council is required';
        }
        break;
      case 'department':
        if (this.grievanceRaiserformGroup?.get('department')?.hasError('required')) {
          return 'Department is required';
        }
        break;
      default:
        return '';
    }
    return
  }

  onReset() {
    this.submitted = false;
    // To hide red validation msgs on submition successfull
    this.grievanceRaiserformGroup = undefined
    setTimeout(() => {
      this.grievanceRaiserformGroup = this.createForm();
    },);
    // this.grievanceRaiserformGroup?.reset();
    // Object.keys(this.grievanceRaiserformGroup).forEach((key: string) => {
    //   const control = this.grievanceRaiserformGroup.get(key);
    //   control!.markAsPristine();
    //   control!.markAsUntouched();
    // });
    this.listOfFiles = [];
    this.files= [];
    this.ticketDetails= {};
    this.departmentsList = [];
  }

  handleFileUpload(event: any) {
    //console.log("event =>", event);
    this.fileUploadError = '';
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];
      //console.log(event.target.files);
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
            console.log('file already exists');
          }
        } else {
          this.fileUploadError = 'Please upload files with size less than 5MB';
        }
      } else {
        this.fileUploadError = `Please upload ${allowedExtensions.join(', ')} files`;
      }
    }
    //console.log("Files info", this.listOfFiles);
    //console.log("Files info", this.files);

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
      ...this.dialogSettings
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed', result);
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
    //console.log(value)
    const {name, email, phone, userType, council, department, description } =  value;
    const lastIndex = name.lastIndexOf(" ");

    const firstName = lastIndex > 0 ? name.substring(0, lastIndex) : name;
    const lastName = lastIndex > 0 ? name.substring(lastIndex + 1) : '';
    this.ticketDetails = {
      name,
      firstName,
      lastName: !!lastName  ? lastName : "",
      email,
      phone,
      ticketUserTypeId: userType,
      ticketCouncilId: council,
      ticketDepartmentId: department,
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
    let uploadFileRequests :Observable<any>[] =[];
    this.files.forEach((file) => {
      const formData = new FormData();
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
    const fileUploadUrlResponses: any = [];
    const ticketDetails = { ...this.ticketDetails, otp: otpDetails?.emailOTP,mobileOtp: otpDetails?.mobileOTP};
    delete ticketDetails.name;
  
    // Call uploadFiles to upload attachments
    this.uploadFiles().pipe(
      switchMap((uploadResponses) => {
        uploadResponses.map((obj: any,index) => {
          fileUploadUrlResponses.push(obj.responseData.result.url);
        })
        // Extract attachmentUrls from uploadResponses
        const attachmentUrls = fileUploadUrlResponses;
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
        console.log(err)
        this.toastrService.showToastr(err?.error.error_message, 'Error', 'error', '');
        this.submitted = false;
        // Handle the error here in case of file upload or ticket creation failure
      }
    });
  }
}
