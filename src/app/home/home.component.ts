import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public dialog: MatDialog
    , private http: HttpClient
    , private _behaviorSubject: BehaviorSubjectService
  ) { }
  myPosition = 0;
  imageObjects = [];
  db = [];
  myImg() {
    return this.db[this.myPosition];
  }
  updateImg(i) {
    this.myPosition = i;
    console.log("hello" + i);

    var top = document.getElementById("card").offsetTop + 120; //Getting Y of target element
    console.log("offset" + top);
    window.scrollTo(200, top);
  }
  processImages(imagesDB) {
    //let imageDB = JSON.parse(imagesDB);
    //this.db = imagesDB["imagesDB"][0]; 
    this.imageObjects = imagesDB["imagesDB"][0];
    this.db = [];
    var count = 0;
    for (var object in this.imageObjects) {

      this.db.push(this.imageObjects[count]["url"]);
      count++;
    }
    //this.db.reverse();
  }
  getImages() {
    this.http.get('https://switchmagic.com:4111/getImages').subscribe(imagesDB => { console.log(imagesDB); this.processImages(imagesDB); });
  }
  ngOnInit() {
    this.getImages();
    let that = this;
    this._behaviorSubject.elements.subscribe(event => {
      setTimeout(function () {
        console.log("get images!");
        that.getImages();
      }, 1000);

    });

  }

}
