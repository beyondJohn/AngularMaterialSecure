import { Component, OnInit, AfterViewInit, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { EditComponent } from '../edit/edit.component';
import { Router } from '@angular/router';
import { ShowcasesService } from '../services/showcases.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit {
  showcases = [];
  constructor(
    public dialog: MatDialog
    , private http: HttpClient
    , private _behaviorSubject: BehaviorSubjectService
    , private _showcaseTypesService: ShowcasesService
    , private _router: Router
  ) {
    this.description = "";
   }
  myPosition = [];
  imageObjects = [];
  db = [];
  dbTypesArray = [];
  description;
  date;
  comment;
  openVert(type) {
    localStorage.setItem("activeType", type);
    this._router.navigate(['/vert']);
  }
  myImg() {

    // check if array of showcases 'db' is loaded before attempting to access each showcase's image objects  
    if (this.db.length > 0) {
      // set string values for description, date, & comment before returning the image url to the view
      // this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
      // this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
      // this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;
      localStorage.setItem("activeType", this.db[this.myPosition[0]][this.myPosition[1]].type)
      return this.db[this.myPosition[0]][this.myPosition[1]].url;
    }
    return "";
  }
  updateImg(s, i) {
    console.log("this.myPosition: ",this.myPosition);
    console.log("this.db: ",this.db);
    this.myPosition = [s, i];
    var top = document.getElementById("card").offsetTop + 10; //Getting Y of target element
    window.scrollTo({
      top: top,
      behavior: 'smooth',
    });
    this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
      this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
      this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;
  }
  processImages(imagesDB) {
    this.db = [];
    this.dbTypesArray = []
    this.imageObjects = imagesDB["imagesDB"];

    // Begin sort images into showcase arrays & add image types to type array
    this.imageObjects.forEach(imgObj => {
      if (this.dbTypesArray.indexOf(imgObj.type) == -1) {
        this.dbTypesArray.push(imgObj.type);
      }
    });
    for (let i = 0; i < this.dbTypesArray.length; i++) {
      let tempShowcase = [];
      this.imageObjects.forEach(imageObj => {
        if (imageObj.type.toUpperCase() == this.dbTypesArray[i].toUpperCase()) {
          imageObj.type = imageObj.type.toUpperCase();
          tempShowcase.push(imageObj);
        }
      });
      this.db.push(tempShowcase.reverse());
    }
    this.myPosition = [0, 0]
    // End sort & organize image types into type arrays
    this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
      this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
      this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;
  }
  processShowcaseTypes(imagesDB: Object) {
    this._showcaseTypesService.refreshshowcasesDb(imagesDB);
  }
  getImages() {
    this.http.get('https://switchmagic.com:4111/getImages')
      .subscribe(imagesDB => {
        this.processImages(imagesDB);
        this.processShowcaseTypes(imagesDB);
      });
  }

  ngOnInit() {
    //this.getImages();
    

  }
  ngAfterViewInit(){
    let that = this;
    this._behaviorSubject.elements.subscribe(event => {
      setTimeout(function () {
        that.getImages();
      }, 1000);

    });
    this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      that.showcases = [];
      
      showcases['showcaseTypesArray'].forEach(typeObj => {
        that.showcases.push(typeObj);
      });
    })
  }
  openDialog() {
    this.dialog.open(DialogDefaultComponent);
  }
  edit(img) {
    let date = this.db[this.myPosition[0]][this.myPosition[1]].date;
    let desc = this.db[this.myPosition[0]][this.myPosition[1]].description;
    let comm = this.db[this.myPosition[0]][this.myPosition[1]].comment;
    let type = this.db[this.myPosition[0]][this.myPosition[1]].type;
    let image = this.db[this.myPosition[0]][this.myPosition[1]].image;
    let timestamp = this.db[this.myPosition[0]][this.myPosition[1]].timestamp;
    this.dialog.open(EditComponent, { data: { date:date, img: img, description: desc, comment: comm, type: type, timestamp: timestamp, image: image } });
  }

}