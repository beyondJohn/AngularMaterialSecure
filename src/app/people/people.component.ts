import { Component, OnInit } from '@angular/core';
import { InvitationsComponent } from '../invitations/invitations.component';
import { MatDialog } from '@angular/material';
import { NotificationsService } from '../services/notifications.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  constructor(
    public dialog: MatDialog
    , public _noification: NotificationsService
    , private _http: HttpClient
  ) { }
  countConnected;
  connections = [];
  activeInvitations = [];
  notify = [];
  ngOnInit() {
    this._noification.notification.subscribe(notify => {
      // notify is an array of invitations with 4 properties: date, inviterName, status,userNumber
      console.log("notify: ", notify);
      this.notify = notify;
      this.buildInvitations(notify);
      this.buildConnections();
      this.countConnected = 0;
    });
  }
  buildInvitations(notify) {
    // notify is an array of invitations with 4 properties: date, inviterName, status,userNumber
    notify.forEach(notification => {
      if (notification.status == "0") {
        this.activeInvitations.push(notification);
      }
    });

  }
  buildConnections() {
    var id = localStorage.getItem("acc");
    this._http.get('https://switchmagic.com:4111/getImages?id=' + id)
      .subscribe(imagesDB => {
        // get connections from JSON
        imagesDB["people"].connections.forEach(connection => {
          if (connection.status == "1") {
            this.connections.push(connection);
          }
        });
      });
  }
  viewInvitation(inviterNumber) {
    console.log("inviterNumber: ", inviterNumber);
    this.dialog.open(InvitationsComponent, { data: { notify: this.notify, inviterNumber: inviterNumber } });
  }
  viewPerson(userNumber) {
    console.log(userNumber);
  }
}
