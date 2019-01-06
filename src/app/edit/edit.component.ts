import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config';
import { Observable } from 'rxjs';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { MatDialogRef } from '@angular/material/dialog';

export interface Showcase {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    , private _httpClient: HttpClient
    , private _config: Config
    , private _behaviorSubject: BehaviorSubjectService
    , public dialogRef: MatDialogRef<EditComponent>
  ) {
    this.selectedValue = this.data.type;
  }
  selectedValue: string;
  showcases: Showcase[] = [
    { value: '0', viewValue: 'Family' },
    { value: '1', viewValue: 'Friends' },
    { value: '2', viewValue: 'Fun' },
    { value: '3', viewValue: 'Food' },
    { value: '4', viewValue: 'Nature' }
  ];
  ngOnInit() {
    console.log('data: ', this.data);
  }
  delete(img): Observable<void> {
    return this._httpClient.delete<void>(this._config.urls.apiEndPoint + "/delete/" + img);
  }
  deleteImage(img){
    console.log("Im here: " , img.data);
    let image = this.data.image.replace(".jpg","") + "---" + this.data.timestamp;
    this.delete(image).subscribe(()=>{
      this._behaviorSubject.refreshElements('refresh');
      console.log("deleted");
      this.dialogRef.close();
    });
    
  }
}
