import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InvitationsComponent } from '../invitations/invitations.component';
import { MatDialog } from '@angular/material';
import { NotificationsService } from '../services/notifications.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShowcasesService } from '../services/showcases.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { GetImageDbService } from '../services/get-image-db.service';
import { BehaviorSubject } from 'rxjs';

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
    , public _showcases: ShowcasesService
    , public dialogRef: MatDialogRef<PeopleComponent>
    , private _behaviorSubject: BehaviorSubjectService
    , private _getImageDb: GetImageDbService
  ) { }
  countConnected;
  connections = [];
  activeInvitations = [];
  notify = [];
  //
  search = false;
  personFound;
  personFoundStage1;
  invalidPerson;
  userName;
  showcases = [];
  //
  ngOnInit() {
    this._noification.notification.subscribe(notify => {
      // notify is an array of invitations with 4 properties: date, inviterName, status,userNumber
      console.log("notify: ", notify);
      this.notify = notify;
      this.buildInvitations(notify);
      this.buildConnections();
      this.countConnected = 0;
    });
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    });
    this._behaviorSubject.acceptedInvite.subscribe(accepted =>{
      if(accepted['accept'] == 'accept'){
        
        this.dialogRef.close();
      }
    })
  }
  getUserName4UI() {

    if (this.userName) {
      return this.userName.toUpperCase();
    }
    return
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
  //
  //
  clearSearch() {
    this.personFound = undefined;
    this.personFoundStage1 = undefined;
    this.userName = undefined;
    this.invalidPerson = undefined;
    this.search = false;
  }
  addPeople() {
    this.search = !this.search;
  }
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
  inviteUserNumber;
  searchPeople(form: NgForm) {
    this.invalidPerson = undefined;
    let searchTerm = JSON.stringify(form.value);
    let token = localStorage.getItem("jwt");
    this._http.post("https://switchmagic.com/api/customers", searchTerm, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      if (response["userNumber"] == localStorage.getItem("acc")) {
        alert("You can't send invitations to yourself. You need to get out more, make some friends ;-)");
        this.dialogRef.close();
      }
      var imgDb = JSON.parse(localStorage.getItem('imagesDB'));
      var connectionAlreadyExists;
      imgDb["people"]["connections"].forEach(connection => {
        // check if user already a connection
        if (connection.inviterNumber == response["userNumber"]) {
          connectionAlreadyExists = true;
        }
      });
      if (connectionAlreadyExists) {
        alert("You are already connected to " + response["userName"] +"!");
        this.dialogRef.close();
      }
      if(connectionAlreadyExists == undefined){
        // check for pending invitations and declined invitations
        imgDb["people"]["invitations"]["received"].forEach(receivedInvitation => {
          if(receivedInvitation.userNumber == response["userNumber"]){
            // already received invitation, check status
            // if not yet accepted/declined
            if(receivedInvitation.status == 0){
              alert('You already have a pending invitation from ' + response["userName"] + ". Please repond to the existing invitation");
              this.dialogRef.close();
            }
            // if already declined
            else if(receivedInvitation.status == 2){
              var confirm = confirm('You have already declined an invitation from ' + response["userName"] + ". Would you like to continue with sending this invitation?");
              if (confirm == true) {
                
              } else {
                this.dialogRef.close();
              }
            }
          }
        });
        if (response["found"]) {
          //let searchTerm = JSON.stringify(form.value);
          this.personFound = true;
          this.personFoundStage1 = true;
          this.userName = form.value["username"];
          this.inviteUserNumber = response["userNumber"];
        }
        else {
          console.log("user not found, try again");
          this.invalidPerson = true;
        }
        console.log("check response: ", response);
      }
      else {
        
      }
    }, err => {
      console.log("Something went wrong");
    });
  }
  invitationSent;
  sendInvite(inviteeUserName) {
    console.log("sending invite:", this.inviteUserNumber);
    let acc = localStorage.getItem("acc");
    let idName = localStorage.getItem("userName");
    this._http.post("https://switchmagic.com:4111/api/invite", { 
      userNumber: this.inviteUserNumber
      , id: acc
      , showcaseArray: JSON.stringify(this.checkboxShowcases)
      , idName: idName
      , inviteeUserName: inviteeUserName }, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      console.log(response);
      this.personFound = undefined;
      this.invitationSent = true;
    }, err => {
      console.log("Something went wrong");
    });
  }
}
