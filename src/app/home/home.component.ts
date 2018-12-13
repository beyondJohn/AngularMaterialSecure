import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
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
      console.log("object: ", this.imageObjects[count]);
      this.db.push(this.imageObjects[count]["url"]);
      count++;
    }
    //this.db.reverse();
  }
  ngOnInit() {
    this.http.get('https://switchmagic.com:4111/getImages').subscribe(imagesDB => { console.log(imagesDB); this.processImages(imagesDB); });
  }

}
