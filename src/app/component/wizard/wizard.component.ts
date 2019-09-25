import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileService } from '../../services/file.service';

class Info {
  public firstName: string;
  public lastName: string;
  public dob: any;
  public photoId: any;
  public dateCreated: any;
}

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  @Input('isOpen') isOpen     : boolean = true;
  @Output() closeModal        = new EventEmitter();
  public form                 : FormGroup;
  public submitted            : boolean = false;
  public submitting           : boolean = false;
  public model                : Info = new Info();
  public error                : string;
  public user                 : any;
  public page                 : number = 1;
  public sizeError            : string;
  public fileObj              = {name: "", file: null}

  constructor(private formBuilder: FormBuilder, private fileService: FileService) {}

  ngOnInit() {
    this.buildForm();
  }

  public buildForm() {
    this.form = this.formBuilder.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        day: ["", Validators.required],
        month: ["", Validators.required],
        year: ["", Validators.required],
        dob: ["", Validators.required],
        dateCreated: ["", Validators.required],
        photoId: [null, Validators.required]
    });
  }

  public onFileSelect($event) {
    const TEN_MB = 10485760;

    if ($event.target.files[0].size <= TEN_MB) { 
      this.sizeError = '';
      let file:File = $event.target.files[0];
      this.fileObj = { name:file.name, file:file };
      this.form.controls.photoId.setValue(this.fileObj);
    } else {
      console.log($event.target.files[0].size, 'invalid size');
      this.sizeError = 'This Photo is too large. Max upload size is 10MB.';
    }  
  }

  public validatePage() {
    let form = this.form.value;
    if (this.form.controls['firstName'].valid === true &&
      this.form.controls['lastName'].valid === true && 
      !form.day && !form.month && !form.year) {
      this.page = 2;
      //this.submit();
    } else if (this.page != 3 && form.day && form.month && form.year) {
        let d = new Date(form.year, form.month - 1, form.day);
        this.form.controls.dob.setValue(d);
        this.page = 3;
       //this.submit();
    } else if (this.page === 3 && this.form.controls['photoId'].valid === true) {
      this.submit();
    } else {
      this.validate(this.form, '');
    }
  }

  public validate(formGroup: FormGroup, fieldName) {
    Object.keys(formGroup.controls).forEach(field => {

      if (this.page === 3 && field === 'photoId') {

        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
          control.markAsDirty();
        } else if (control instanceof FormGroup) {
          this.validate(control, 'photoId');
        }

      } else if (this.page === 1 && (field === 'firstName' || field === 'lastName')) {

        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      }  else if (this.page === 2 && (field === 'day' || field === 'month' || field === 'year')) {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
          control.markAsDirty();
        }
      }
    });
  }

  public submit() {
    console.log('submit data...');
    this.error = null;
    this.submitted = true;
    this.submitting = true;
    let form = this.form.value;
    console.log(form, 'form value');
    this.model.firstName = form.firstName;
    this.model.lastName = form.lastName;
    this.model.dob = form.dob;
    this.model.dateCreated = new Date();
    this.model.photoId = form.photoId;
    this.fileService.upload(this.model);
    setTimeout(()=>{
      this.submitting = false;
      this.page = 4;
    }, 1000)
  }

  public previousPage() {
    this.page -= 1;
  }

  public close() {
    this.page = 1;
    this.isOpen = false;
    this.error = null; 
    this.buildForm();
    //TODO reset();
  }

}

