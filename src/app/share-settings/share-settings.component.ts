import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';

@Component({
  selector: 'app-share-settings',
  templateUrl: './share-settings.component.html',
  styleUrls: ['./share-settings.component.css']
})
export class ShareSettingsComponent implements OnInit {

  constructor(
    public dialog: MatDialog
    , public dialogRef: MatDialogRef<ShareSettingsComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any
    , private _showcases: ShowcasesService
    , private _httpClient: HttpClient
    , private _config: Config
  ) { }
  showcases = [];
  imagesDB;
  ngOnInit() {
    this.imagesDB = localStorage.getItem('imagesDB');
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
      this.filterShowcases();
    });
  }

  // the following is used to update showcases listed in people.invitations.sent.sharedShowcases 
  updateShowcaseSentRecord(status): Observable<void> {
    var inviteeNumber = this.data.userNumber;
    var inviteeName = this.data.userName;
    var id = localStorage.getItem("acc");
    // Initialize Params Object
    let params = new HttpParams();
    // Begin assigning parameters
    console.log('inviter', inviteeNumber);
    console.log('status', status);
    console.log('id', id);
    // console.log('inviterName', this.inviterName);
    params = params.append('inviteeNumber', inviteeNumber);
    params = params.append('inviteeName', inviteeName);
    params = params.append('status', status);
    params = params.append('id', id);
    // params = params.append('inviterName', this.inviterName);
    return this._httpClient.post<void>(this._config.urls.apiEndPoint + "/updatesentrecord", params);
  }

  filteredShowcases = [];
  filterShowcases() {
    this.filteredShowcases = [];
    this.showcases.forEach(showcase => {
      if (showcase.viewValue.indexOf("---") == -1) {
        // console.log("72invitations.ts-showcase.viewValue: ", showcase.viewValue)
        this.filteredShowcases.push(showcase);
      }
    });
    this.setCheckBoxesInitValues();
  }

  setCheckBoxesInitValues() {
    //get sent invitation from people db
    var db = JSON.parse(this.imagesDB);
    if(db['people']['invitations']['sent'].length > 0){
      db['people']['invitations']['sent'].forEach(invitation => {
        if (invitation['userNumber'] == this.data.userNumber) {
          // get shared showcases
          invitation['sharedShowcases'].forEach(showcaseTitle => {
            console.log(showcaseTitle);
          });
        }
      });
    }
  }

  saveSettings() {
    console.log('clicked');
    console.log("data: ", this.data.userNumber);
    var db = JSON.parse(this.imagesDB);
    db['people']['connections'].forEach(connection => {
      if (connection['inviterNumber'] == this.data.userNumber) {
        console.log('savesetting for: ', this.data.userNumber);
      }
    });
    // this.dialogRef.close();

  }

  //
  // checkbox Utility
  remove(removeValue) {
    var tempArray = [];
    this.checkboxShowcases.forEach(showcase => {
      if (showcase != removeValue) {
        tempArray.push(showcase);
      }
    });
    this.checkboxShowcases = tempArray;
    //console.log(this.checkboxShowcases);
  }
  checkboxShowcases = [];
  checkBox(boxName) {
    console.log(boxName);
    if (this.checkboxShowcases.indexOf(boxName) == -1) {
      this.checkboxShowcases.push(boxName);
    }
    else {
      this.remove(boxName);
    }
  }
  checkBoxLabels(showcase) {
    if (showcase != undefined) {
      return showcase["viewValue"];
    }
    return
  }
}
