import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { SharedDialogOverlayComponent } from '../../../../shared/components/shared-dialog-overlay/shared-dialog-overlay.component';
import {MatDialog} from '@angular/material/dialog';

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

  grievancesTypesArray = [
    'Registration', 'Affiliation', 'Hall-ticket', 'Others'
  ]
  userTypesArray = [
    'Candidate', 'Institute', 'Faculty', 'Others'
  ]

  public grievanceRaiserformGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    this.grievanceRaiserformGroup = this.formBuilder.group({
      name: new FormControl('arun@awe.com', [
        Validators.required]),
      email: new FormControl('arun@awe.com', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobNumber: new FormControl('8989786756', [
        Validators.required,
        Validators.pattern("^(0|91)?[6-9][0-9]{9}$")]),
      grievanceType: new FormControl('', [
        Validators.required]),
        userType: new FormControl('', [
          Validators.required])
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
        case 'mobNumber':
        if (this.grievanceRaiserformGroup.get('mobNumber')?.hasError('required')) {
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
  
  ongrievanceRaiserformSubmit(value : any){
    console.log(value)
    this.submitted = true;
    if( this.grievanceRaiserformGroup.valid){
      this.openBulkUploadDialog();
    }
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

  onFileChanged(event?: any){
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      let selectedFile = event.target.files[i];
   
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        console.log();
        this.listOfFiles.push(selectedFile.name.concat(this.formatBytes(selectedFile.size)));
      }
    }
  }

  removeSelectedFile(index: any) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
  }

  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

openBulkUploadDialog(): void {
  const dialogRef = this.dialog.open(SharedDialogOverlayComponent, {
    data: { },
    maxWidth: '400vw',
    maxHeight: '100vh',
    height: '50%',
    width: '30%',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.animal = result;
  });
}
}
