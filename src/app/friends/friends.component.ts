import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShowcasesService } from '../services/showcases.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(
    private _http: HttpClient
    , public _showcases: ShowcasesService
  ) { }
  search = false;
  personFound;
  personFoundStage1;
  invalidPerson;
  userName;
  showcases = [];
  ngOnInit() {
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    });
  }
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
  }
  checkboxShowcases = [];
  checkBox(boxName) {
    if (this.checkboxShowcases.indexOf(boxName) == -1) {
      this.checkboxShowcases.push(boxName);
    }
    else {
      this.remove(boxName);
    }
  }
  inviteUserNumber;
  searchPeople(form: NgForm) {
    let searchTerm = JSON.stringify(form.value);
    let token = localStorage.getItem("jwt");
    this._http.post("https://switchmagic.com/api/customers", searchTerm, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      if (response["found"]) {
        //let searchTerm = JSON.stringify(form.value);
        this.personFound = true;
        this.personFoundStage1 = true;
        this.userName = form.value["username"];
        this.inviteUserNumber = response["userNumber"];
      }
      else {
        console.log("user not found, try again");
      }

    }, err => {
      console.log("Something went wrong");
    });
  }
  invitationSent;
  sendInvite() {
    let acc = localStorage.getItem("acc");
    let idName = localStorage.getItem("userName");
    this._http.post("https://switchmagic.com:4111/api/invite", { userNumber: this.inviteUserNumber, id: acc, showcaseArray: JSON.stringify(this.checkboxShowcases), idName: idName }, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      this.personFound = undefined;
      this.invitationSent = true;
    }, err => {
      console.log("Something went wrong");
    });
  }
}
