import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config';
import { Observable } from 'rxjs';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowcasesService } from '../services/showcases.service';


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
    , private _showcaseTypesService: ShowcasesService
  ) {
    this.selectedValue = this.data.type;
  }
  selectedValue: string;
  showcases = [];
  ngOnInit() {
    this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);  
      });
    });

    let showcaseLocalStorage = localStorage.getItem('showcasetypes');
    if(showcaseLocalStorage){
      this.showcases = [];
      let tempShowcaseTypes = JSON.parse(showcaseLocalStorage);
      tempShowcaseTypes.forEach(typeObj => {
        this.showcases.push(typeObj);  
      });
    } 
  }
  delete(img): Observable<void> {
    return this._httpClient.delete<void>(this._config.urls.apiEndPoint + "/delete/" + img);
  }
  deleteImage(img){
    let image = this.data.image.replace(".jpg","") + "---" + this.data.timestamp;
    this.delete(image).subscribe(()=>{
      this._behaviorSubject.refreshElements('refresh');
      this.dialogRef.close();
    });
    
  }
}
