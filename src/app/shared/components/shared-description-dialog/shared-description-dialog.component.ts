import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shared-description-dialog',
  templateUrl: './shared-description-dialog.component.html',
  styleUrls: ['./shared-description-dialog.component.scss']
})
export class SharedDescriptionDialogComponent {
  //#region (global variables)
  dialogDetails: any;
  dynamicFormGroup: FormGroup;
  //#endregion

  //#region (constructor)
  constructor(
    public dialogRef: MatDialogRef<SharedDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogDetails = data;
    this.dynamicFormGroup = this.createFormControls(data.controls);
  }

  createFormControls(controls: any[]) {
    const formGroup: any = {}
    if (controls && controls.length) {
      controls.forEach((control: any) => {
        let validators: any[] = []
        if (control.validators) {
          control.validators.forEach((validator: any) => {
            switch(validator.key) {
              case 'required':
                validators.push(Validators.required);
                break;
              case 'maxLength':
                validators.push(Validators.maxLength(validator.value));
            }
          })
        }

        formGroup[control.controlName] = new FormControl(control.value, validators)
      })
    }
    return new FormGroup(formGroup);
  }

  buttonClicked(type: string) {
    if (type === 'close') {
      this.dialogRef.close()
    } else {
      this.submit(type)
    }
  }

  submit(type: string) {
    if (this.dynamicFormGroup.valid) {
      const data = {
        form: this.dynamicFormGroup.value,
        type: type,
      }
      this.dialogRef.close(data)
    }
  }
}
