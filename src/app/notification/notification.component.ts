import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { PeopleComponent } from '../people/people.component';

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
    , public dialog: MatDialog
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
  showcases = [];
  hasInvitation;
  ngOnInit() {
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    });
  }
  manageInvitations() {
    this.dialog.open(PeopleComponent);
    this.dialogRef.close();
  }
}
