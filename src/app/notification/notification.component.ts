import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications = [];
  count = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    , public _showcases: ShowcasesService
    , private _httpClient: HttpClient
    , private _config: Config
    , public dialogRef: MatDialogRef<NotificationComponent>
  ) {
    this.hasInvitation = true;
    this.notifications = this.data.notify;
    this.count = this.notifications.length;
    this.notifications.forEach(invite => {
      if (invite.status != 0) {
        this.hasInvitation = false;
      }
    });
  }
  preDecision;
  accepted;
  declined;
  showcases = [];
  inviterName;
  hasInvitation;
  ngOnInit() {
    this.preDecision = true;
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    });
  }
  accept() {
    // update JSON - set received invite status to 1
    this.updateInvitation("1").subscribe(() => {
      this.preDecision = undefined;
      this.accepted = true;
      this.inviterName = this.notifications[0].inviterName;
      //this.dialogRef.close();
    });
  }
  decline() {
    // update JSON - set received invite status to 2
    this.updateInvitation("2").subscribe(() => {
      this.preDecision = undefined;
      this.declined = true;
      //this.dialogRef.close();
    });
  }
  updateInvitation(status): Observable<void> {
    var inviter = this.notifications[0].userNumber;
    var id = localStorage.getItem("acc");
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('inviter', inviter);
    params = params.append('status', status);
    params = params.append('id', id);
    return this._httpClient.patch<void>(this._config.urls.apiEndPoint + "/invitationResponse", params);
  }
  share() {

  }

  // checkbox Utility
  remove(removeValue) {
    var tempArray = [];
    this.checkboxShowcases.forEach(showcase => {
      if (showcase != removeValue) {
        tempArray.push(showcase);
      }
    });
    this.checkboxShowcases = tempArray;
    console.log(this.checkboxShowcases);
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
}
