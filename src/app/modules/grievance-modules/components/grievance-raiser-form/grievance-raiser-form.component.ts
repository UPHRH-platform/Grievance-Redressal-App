import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { SharedDialogOverlayComponent } from '../../../../shared/components/shared-dialog-overlay/shared-dialog-overlay.component';
import { MatDialog } from '@angular/material/dialog';
import { GrievanceServiceService } from '../../services/grievance-service.service';
import { ConfigService } from 'src/app/shared';
import { ToastrServiceService,  } from 'src/app/shared/services/toastr/toastr.service';


@Component({
  selector: 'app-grievance-raiser-form',
  templateUrl: './grievance-raiser-form.component.html',
  styleUrls: ['./grievance-raiser-form.component.scss']
})


export class GrievanceRaiserFormComponent {

  @ViewChild('attachments') attachment: any;

  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;
  submitted = false;
  files: any[] = [];
  fileUploadError: string;
  ticketDetails: any;
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
    private toastrService: ToastrServiceService
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



  radioChecked(e: any, e1: any) {
    console.log(e)
  }

  grievanceSelected(grievance: Event) {
    console.log(grievance)
  }

  onReset() {
    this.submitted = false;
    this.grievanceRaiserformGroup.reset();
    this.listOfFiles = [];
  }

  onFileChanged(event?: any) {
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];

      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        console.log();
        this.listOfFiles.push(selectedFile.name.concat(this.formatBytes(selectedFile.size)));
      }
    }
  }

  // removeSelectedFile(index: any) {
  //   // Delete the item from fileNames list
  //   this.listOfFiles.splice(index, 1);
  //   // delete file from FileList
  //   this.fileList.splice(index, 1);
  // }

  //   formatBytes(bytes: any, decimals = 2) {
  //     if (!+bytes) return '0 Bytes'
  //     const k = 1024
  //     const dm = decimals < 0 ? 0 : decimals
  //     const sizes = ['Bytes', 'KB', 'MB']
  //     const i = Math.floor(Math.log(bytes) / Math.log(k))
  //     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  // }

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
    const dialogRef = this.dialog.open(SharedDialogOverlayComponent, {
      data: {otpSubmitted},
      maxWidth: '400vw',
      maxHeight: '100vh',
      height: '50%',
      width: '30%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(!!result) {
        this.createTicket();
      }
    });
  }

  onSubmit(value: any) {
    console.log(value)
    const {name, email, phone, grievanceType, userType, description } =  value;
    this.ticketDetails = {
      name,
      email,
      phone,
      cc: [grievanceType],
      userType,
      description,
      attachmentUrls: []
    }
    this.openSharedDialog(false); 
  }

  createTicket() {
    this.submitted = true;
    this.grievanceService.createTicket(this.ticketDetails).subscribe({
      next: (res) => {
        this.toastrService.showToastr("Grievance ticket is created successfully!", 'Success', 'success', '');
        this.submitted= false;
        this.openSharedDialog(true);
     },
     error: (err) => {
      this.toastrService.showToastr(err, 'Error', 'error', '');
      this.submitted= false;
       // Handle the error here in case of login failure
     }
    });  
  }
}
