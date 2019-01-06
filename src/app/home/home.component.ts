import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { EditComponent } from '../edit/edit.component';

export interface Showcase {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  showcases: Showcase[] = [
    { value: '0', viewValue: 'Family' },
    { value: '1', viewValue: 'Friends' },
    { value: '2', viewValue: 'Fun' },
    { value: '3', viewValue: 'Food' },
    { value: '4', viewValue: 'Nature' }
  ];
  constructor(
    public dialog: MatDialog
    , private http: HttpClient
    , private _behaviorSubject: BehaviorSubjectService
  ) { }
  myPosition = [];
  imageObjects = [];
  db = [];
  dbTypesArray = [];
  description = "meBloggy";
  date = "Thursday December 26, 2018";
  comment = "";
  myImg() {

    // check if array of showcases 'db' is loaded before attempting to access each showcase's image objects  
    if (this.db.length > 0) {
      // set string values for description, date, & comment before returning the image url to the view
      this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
      this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
      this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;
      return this.db[this.myPosition[0]][this.myPosition[1]].url;
    }
    return "";
  }
  updateImg(i, s) {
    this.myPosition = [s, i];
    console.log("hello" + i);

    var top = document.getElementById("card").offsetTop + 10; //Getting Y of target element
    console.log("offset" + top);
    window.scrollTo({
      top: top,
      behavior: 'smooth',
    });
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
        if (imageObj.type == this.dbTypesArray[i]) {
          tempShowcase.push(imageObj);
        }
      });
      this.db.push(tempShowcase.reverse());
    }
    this.myPosition = [0, 1]
    // End sort & organize image types into type arrays
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
  openDialog() {
    this.dialog.open(DialogDefaultComponent);
  }
  edit(img) {
    let desc = this.db[this.myPosition[0]][this.myPosition[1]].description;
    let comm = this.db[this.myPosition[0]][this.myPosition[1]].comment;
    let type = this.db[this.myPosition[0]][this.myPosition[1]].type;
    let image = this.db[this.myPosition[0]][this.myPosition[1]].image;
    let timestamp = this.db[this.myPosition[0]][this.myPosition[1]].timestamp;
    this.dialog.open(EditComponent, { data: { img: img, description: desc, comment: comm, type: type, timestamp: timestamp, image:image } });
    console.log('img: ', img);
  }

}
