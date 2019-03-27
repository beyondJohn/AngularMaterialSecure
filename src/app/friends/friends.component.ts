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
  clearSearch(){
    this.personFound = undefined;
    this.userName = undefined;
    this.invalidPerson = undefined;
    this.search = false;
  }
  addPeople(){
    this.search = !this.search;
  }
  sendInvite(userNumber){
    var getReadyToSendInvite = "HI";
    console.log("sending invite:", userNumber);
  }
  searchPeople(form:NgForm){
    let searchTerm = JSON.stringify(form.value);
    let token = localStorage.getItem("jwt");
    this._http.post("https://switchmagic.com/api/customers", searchTerm, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      if(response["found"]){
        //let searchTerm = JSON.stringify(form.value);
        this.personFound = true;
        this.userName = form.value["username"];
        this.sendInvite(response["userNumber"]);
      }
      else{
        console.log("user not found, try again");
      }
      console.log(response);
      
    }, err => {
      console.log("Something went wrong");
    });
  }
}
