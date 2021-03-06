import { Component, OnInit, Inject, AfterViewChecked, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-share-settings',
  templateUrl: './share-settings.component.html',
  styleUrls: ['./share-settings.component.css']
})
export class ShareSettingsComponent implements OnInit, AfterViewInit {

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
  ngAfterViewInit() {
    // for the dynamic checkboxes, we have to drill into the DOM, if there is a sexier way I'll revise later
    this.setCheckBoxesInitValues();

  }

  // the following is used to update showcases listed in people.invitations.sent.sharedShowcases 
  updateShowcaseSentRecord(status): Observable<void> {
    var inviteeNumber = this.data.userNumber;
    var inviteeName = this.data.userName;
    var id = localStorage.getItem("acc");
    let params = new HttpParams();
    params = params.append('inviteeNumber', inviteeNumber);
    params = params.append('inviteeName', inviteeName);
    params = params.append('status', status);
    params = params.append('id', id);
    return this._httpClient.post<void>(this._config.urls.apiEndPoint + "/updatesentrecord", params);
  }

  filteredShowcases = [];
  filterShowcases() {
    this.filteredShowcases = [];
    this.showcases.forEach(showcase => {
      if (showcase.viewValue.indexOf("---") == -1) {
        this.filteredShowcases.push(showcase);
      }
    });
  }

  // this is a complicated  process due to dynamic checkboxes using material
  setCheckBoxesInitValues() {
    var isChecked = false;
    this.filteredShowcases.forEach(showcase => {
      var showcaseTitle = showcase.viewValue;
      isChecked = false;
      //get sent invitation from people db
      var db = JSON.parse(this.imagesDB);
      if (db['people']['invitations']['sent'].length > 0) {
        db['people']['invitations']['sent'].forEach(invitation => {
          if (invitation['userNumber'] == this.data.userNumber) {
            // get shared showcases
            invitation['sharedShowcases'].forEach(myShowcaseTitle => {
              if (myShowcaseTitle == showcaseTitle) {
                isChecked = true;
                // here we hit the DOM for the Material checkbox label, it's found seraching all spans and then the checkbox label text
                var spans = document.getElementsByTagName('span');
                for (var i = 0; i < spans.length; i++) {
                  if (spans[i].innerText == showcase.viewValue) {
                    spans[i].parentElement.click();
                  }
                }
                if (this.checkboxShowcases.indexOf(showcase) == -1) {
                  this.checkboxShowcases.push(showcase);
                }
              }
            });
          }
        });
      }
    });
    return isChecked;
  }

  // save the user preference os which showcases to share with a given connection(person)
  saveSettings() {
    var db = JSON.parse(this.imagesDB);
    db['people']['connections'].forEach(connection => {
      if (connection['inviterNumber'] == this.data.userNumber) {
        var inviteeNumber = this.data.userNumber;
        var inviteeName = this.data.userName;
        var id = localStorage.getItem("acc");
        var showcases = [];
        this.checkboxShowcases.forEach(showcase => {
          showcases.push(showcase.viewValue);
        });
        let params = new HttpParams();
        params = params.append('inviteeNumber', inviteeNumber);
        params = params.append('inviteeName', inviteeName);
        params = params.append('showcases', JSON.stringify(showcases));
        params = params.append('id', id);
        this._httpClient.post<void>(this._config.urls.apiEndPoint + "/updatesharedshowcases", params).subscribe(res =>{
          localStorage.setItem('imagesDB',res['back']);
          this.imagesDB = localStorage.getItem('imagesDB');
          this.dialogRef.close();
        });
      }
    });
  }

  // checkbox Utility, nuts and bolts going on below here shouldn't be edited
  remove(removeValue) {
    var tempArray = [];
    this.checkboxShowcases.forEach(showcase => {
      if (showcase != removeValue) {
        tempArray.push(showcase);
      }
    });
    this.checkboxShowcases = tempArray;
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
