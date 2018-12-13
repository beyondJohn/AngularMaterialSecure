import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { Config } from '../config';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  // fileToUpload: File = null;
  constructor(
    private _httpClient: HttpClient
    , private fb: FormBuilder
    , private _config: Config
    , private _behaviorSubject: BehaviorSubjectService
    , private _router: Router
  ) {
    this.createForm();
  }
  apiEndPoint = this._config.urls.apiEndPoint;
  ngOnInit() {

  }

  createForm() {
    this.form = this.fb.group({
      image: [null, Validators.required]
    });
  }
  // contentAreaSelected(eventValue){
  //   let contentSelector = document.getElementById('contentAreaSelector') as HTMLSelectElement;
  //   contentSelector.value === "Content Area..." ? this.disabled = true : this.disabled = false ;
  // }
  found = false;
  myImage = '../../assets/img/preview.png';
  preview(img) {
    if (img != null && !this.found) {
      this.found = !this.found;
      this.myImage = img;
    }
    return(this.myImage);
  }
  onFileChange(event) {
    this.found = false;
    document.getElementById('complete').innerText = '';
    this.disabled = false;
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      document.getElementsByClassName("mat-button-wrapper")[1].innerHTML = "Change";
      reader.onload = () => {
        this.preview(<string>reader.result);
        this.form.get('image').setValue({
          fieldname: 'image',
          originalname: file.name,
          encoding: '7bit',
          mimetype: 'image/png',
          size: file.size,
          destination: file.destination,
          path: file.path,
          filename: file.name,
          filetype: file.type,
          value: (<string>reader.result).split(',')[1]
        })
      };
    }
    //let contentSelector = document.getElementById('contentAreaSelector') as HTMLSelectElement;
    //contentSelector.value === "Content Area..." ? this.disabled = true : this.disabled = false ;
  }
  openInput() {
    // your can use ElementRef for this later
    document.getElementById("image").click();
  }
  cancel(){
    this._router.navigate(['/home']);
  }
  onSubmit() {
    document.getElementById('complete').innerText = '';
    this.loading = true;
    //let contentSelector = document.getElementById('contentAreaSelector') as HTMLSelectElement;
    //let contentArea = contentSelector.value.replace(' ','');
    let img = document.getElementById("image") as HTMLInputElement;
    let formdata = new FormData();
    formdata.append('image', img.files[0]);
    formdata.append('type', 'kids');
    this._httpClient.post(this.apiEndPoint + '/imageupload/HeaderLogo', formdata).subscribe(
      data => {
        console.log('success: ', data);
        this.loading = false;
        document.getElementById('complete').innerText = 'Upload Complete';
        this.disabled = true;
        this._router.navigate(['/home']);
        // this._behaviorSubject.refreshImagesDB('refresh');
      },
      error => { console.log(error); this.loading = false; }
    );
  }
  disabled = false;
  clearFile() {
    //let contentSelector = document.getElementById('contentAreaSelector') as HTMLSelectElement;
    //var contentArea = contentSelector.value = "Content Area..." ;
    this.form.get('image').setValue(null);
    this.fileInput.nativeElement.value = '';
    document.getElementById('complete').innerText = '';
    this.disabled = false;
  }
  // fileChange(event) {
  //   let fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     let file: File = fileList[0];
  //     let formData: FormData = new FormData();
  //     formData.append('uploadFile', file, file.name);
  //     let headers = new Headers();

  //     //let options = new RequestOptions({ headers: headers });
  //     this._httpClient.post(this.apiEndPoint, { id: '7', name: 'jp', details: file }).subscribe(
  //       data => console.log('success'),
  //       error => console.log(error)
  //     )
  //   }
  // }
}
