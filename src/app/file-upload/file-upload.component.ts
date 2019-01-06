import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { Config } from '../config';
import { BehaviorSubjectService } from '../services/behavior-subject.service';

export interface Showcase {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit, AfterViewInit {
  selectedValue: string;
  showcases: Showcase[] = [
    { value: '0', viewValue: 'Family' },
    { value: '1', viewValue: 'Friends' },
    { value: '2', viewValue: 'Fun' },
    { value: '3', viewValue: 'Food' },
    { value: '4', viewValue: 'Nature' }
  ];
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

  color = 'accent';
  mode = 'determinate';
  value = 0;
  describe = "meBloggy Rocks!";
  comment = "What a great time!";
  apiEndPoint = this._config.urls.apiEndPoint;
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.openInput();
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
  myImage = '../../assets/img/search.png';
  preview(img) {
    if (img != null && !this.found) {
      this.found = !this.found;
      this.myImage = img;
    }
    return (this.myImage);
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
  cancel() {
    this._router.navigate(['/home']);
  }



  onSubmit() {
    let that = this;
    document.getElementById('complete').innerText = '';
    this.loading = true;
    //let contentSelector = document.getElementById('contentAreaSelector') as HTMLSelectElement;
    //let contentArea = contentSelector.value.replace(' ','');
    let img = document.getElementById("image") as HTMLInputElement;
    let formdata = new FormData();
    formdata.append('image', img.files[0]);
    formdata.append('type', this.selectedValue);
    formdata.append('description', this.describe);
    formdata.append('date', new Date().toDateString());
    formdata.append('comment', this.comment);

    this._httpClient.post(this.apiEndPoint + '/imageupload/HeaderLogo', formdata
      , {
        reportProgress: true,
        observe: 'events'
      }
    )
      .subscribe(
        (event) => {
          console.log(event);
          if (event['type'] == 1 && event['loaded'] && event['total']) {
            let percent = 100 - Math.round(parseFloat(event['total']) / parseFloat(event['loaded']));
            console.log('percent: ', percent);
            that.value = percent;
            percent > 98 ? document.getElementById('complete').innerText = 'COMPLETING' : document.getElementById('complete').innerText = percent + '% COMPLETE';

            console.log("event['type']: " + event['type'] + "event['loaded']: " + event['loaded'] + "event['total']: " + event['total']);
          }
          else if (event['type'] > 1) {
            console.log('success: ', event);
            this.loading = false;
            this.disabled = true;
            this._behaviorSubject.refreshImagesDB('refresh');
            this._router.navigate(['/home']);
          }
        },
        err => console.log(err)
      );
    //
    //

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

}

    // //Start WINNER
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', this.apiEndPoint + '/imageupload/HeaderLogo', true);
    // xhr.upload.onprogress = function (e) {
    //   if (e.lengthComputable) {
    //     var percentage = (e.loaded / e.total) * 100;
    //     console.log(percentage);
    //   }
    // };
    // xhr.send(formdata);
    // //End WINNER

    // //new Start
    // var getEventMessage = function (event: HttpEvent<any>, file: File) {
    //   console.log('event type: ', event.type)
    //   switch (event.type) {
    //     case HttpEventType.Sent:
    //       return `Uploading file "${file.name}" of size ${file.size}.`;

    //     case HttpEventType.UploadProgress:
    //       // Compute and show the % done:
    //       const percentDone = Math.round(100 * event.loaded / event.total);
    //       return `File "${file.name}" is ${percentDone}% uploaded.`;

    //     case HttpEventType.Response:
    //       return `File "${file.name}" was completely uploaded!`;

    //     default:
    //       return `File "${file.name}" surprising upload event: ${event.type}.`;
    //   }
    // }