import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';

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
  ) { }
  showcases = [];
  imagesDB;
  ngOnInit() {
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
      this.filterShowcases();
    });
    this.imagesDB = localStorage.getItem('imagesDB');
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
  }

  saveSettings() {
    console.log('clicked');
    console.log("data: ", this.data.userNumber);
    var db =  JSON.parse(this.imagesDB);
    db['people']['connections'].forEach(connection => {
      if (connection['inviterNumber'] == this.data.userNumber) {
        console.log('savesetting for: ', this.data.userNumber);
      }
    });
    // this.dialogRef.close();

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
