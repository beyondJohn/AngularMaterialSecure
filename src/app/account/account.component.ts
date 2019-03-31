import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FriendsComponent } from '../friends/friends.component';
import { PeopleComponent } from '../people/people.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(
    public dialog: MatDialog
    , private router: Router
  ) { }

  ngOnInit() {
  }
  openPeople() {
    // this.dialog.open(FriendsComponent);
    this.dialog.open(PeopleComponent);
  }
  logOut(){
    localStorage.removeItem('jwt');
    this.router.navigate(["login"]);
  }
}
