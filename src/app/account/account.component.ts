import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FriendsComponent } from '../friends/friends.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }
  openPeople() {
    this.dialog.open(FriendsComponent);
  }
}
