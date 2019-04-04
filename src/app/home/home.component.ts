import { Component, OnInit, AfterViewInit, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { EditComponent } from '../edit/edit.component'
import { Router } from '@angular/router';
import { ShowcasesService } from '../services/showcases.service';
import { NotificationsService } from '../services/notifications.service';
import { Config } from '../config';
import { GetImageDbService } from '../services/get-image-db.service';
import { initDomAdapter } from '@angular/platform-browser/src/browser';

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
    , private _notification: NotificationsService
    , private _config: Config
    , private _getImageDb: GetImageDbService
  ) {
    this.description = "";
    this.imgAPI = _config.urls.getImgAPI;
    this.userId = localStorage.getItem("acc");
  }
  myPosition = [];
  imageObjects = [];
  db = [];
  dbTypesArray = [];
  description;
  date;
  comment;
  imgAPI;
  imgSrcType = "/thumbMd";
  userId;
  ngOnInit() {

  }
  afterInit;
  ngAfterViewInit() {
    let that = this;
    this._behaviorSubject.acceptedInvite.subscribe(event => {
      setTimeout(() => {
        this._getImageDb.getImages().subscribe(imagesDB => {
          localStorage.setItem('imagesDB', JSON.stringify(imagesDB));
          this.processImages(imagesDB);
          this.processShowcaseTypes(imagesDB);
          this.processNotifications(imagesDB);
        });
      }, 200);
    });
    this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      that.showcases = [];

      showcases['showcaseTypesArray'].forEach(typeObj => {
        that.showcases.push(typeObj);
      });
    });

    this._getImageDb.imagesDB.subscribe(imagesDB => {
      if (this.afterInit) {
        setTimeout(() => {
          localStorage.setItem('imagesDB', JSON.stringify(imagesDB));

          this.processImages(imagesDB);
          //if (localStorage.getItem("DefaultImage")) {
          var storedImage = localStorage.getItem('DefaultImage');
          if(storedImage != null){
            this.description = storedImage.split('---')[3];
            this.date = storedImage.split('---')[4];
            this.comment = storedImage.split('---')[5];
          }
          
          //}

          // this.processShowcaseTypes(imagesDB);
          //this.processNotifications(imagesDB);
        }, 200);
      }
      this.afterInit = true;
    });
  }
  cleanShowcaseTitle(showcaseTitle) {
    return "Shared By: " + showcaseTitle.split("---")[1] + "-" + showcaseTitle.split("---")[2];
  }
  // figure out which directory to get images from, 
  // might be default /uploads, or owners /uploads/imagesuser#, or from shared user /uploads/imagesinvitors#
  directoryName(imgJSON) {
    if (imgJSON.isSeed) {
      return '';
    }
    // get invitors number from the type string, username & # appended to type string when shared images are compiled 
    if (imgJSON.isShared) {
      return '/images' + imgJSON.type.split('---')[0];
    }
    return '/images' + this.userId;
  }
  isMyImgInit = true;
  myImg() {

    // set default home main showcase image if exists in localstorage, else load first img from first showcase
    if (this.isMyImgInit) {
      if (this.db.length > 0) {
        if (localStorage.getItem("DefaultImage")) {
          var showcaseType = localStorage.getItem("DefaultImage").split("---")[2].toUpperCase();
          for (var i = 0; i < this.db.length; i++) {
            if (this.db[i][0].type == showcaseType) {
              var timestamp = localStorage.getItem("DefaultImage").split("---")[0];
              var imgName = localStorage.getItem("DefaultImage").split("---")[1];
              for (var r = 0; r < this.db[i].length; r++) {
                if (this.db[i][r]["timestamp"] == timestamp && this.db[i][r]["image"] == imgName) {
                  this.myPosition = [i, r];
                }
              }
            }
          }
        }
        console.log(this.db);
        this.isMyImgInit = !this.isMyImgInit;
      }
    }
    // check if array of showcases 'db' is loaded before attempting to access each showcase's image objects  
    if (this.db.length > 0) {
      // set string values for description, date, & comment before returning the image url to the view
      localStorage.setItem("activeType", this.db[this.myPosition[0]][this.myPosition[1]].type);
      return this.db[this.myPosition[0]][this.myPosition[1]].url;
    }
    return "";
  }
  updateImg(s, i) {
    console.log("this.myPosition: ", this.myPosition);
    console.log("this.db: ", this.db);
    this.myPosition = [s, i];
    var top = document.getElementById("card").offsetTop + 10; //Getting Y of target element
    window.scrollTo({
      top: top,
      behavior: 'smooth',
    });
    if (this.db.length > 0) {
      this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
      this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
      this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;

      localStorage.setItem("DefaultImage", this.db[this.myPosition[0]][this.myPosition[1]].timestamp
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].image
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].type
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].description
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].date
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].comment
      );

    }
  }
  processImages(imagesDB) {
    this.db = [];
    this.dbTypesArray = []
    this.imageObjects = imagesDB["imagesDB"];
    if (this.imageObjects.length > 0 ) {
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
      if (this.db.length > 0) {
        if (localStorage.getItem('DefaultImage')) {
          var storedImage = localStorage.getItem('DefaultImage');
          this.description = storedImage.split('---')[3];
          this.date = storedImage.split('---')[4];
          this.comment = storedImage.split('---')[5];
        }
        else {

          this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
          this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
          this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;
        }

      }
    }

  }
  showcaseTitles(showcaseData){
    console.log("203 home.ts showcaseData: ", showcaseData);
    try{
      if(showcaseData.viewValue != undefined)
      {
        return showcaseData.viewValue;  
      }
    }
    catch{
      // this whole try catch and get images block is a bit of a hack and should be handled more gracefully but I dont have the time or the patience now
      // when user accepts invitation somewhere the shared users showcase titles get lost, but are found if we grab a fresh imagedb from server 
      setTimeout(() => {
        this._getImageDb.getImages().subscribe(imagesDB => {
          localStorage.setItem('imagesDB', JSON.stringify(imagesDB));
          this.processImages(imagesDB);
          this.processShowcaseTypes(imagesDB);
          this.processNotifications(imagesDB);
        });
      }, 100);
    }
    
    return;
    //showcases[s].indexOf('---') != -1 ? cleanShowcaseTitle(showcases[s]) : showcases[s]
  }
  processShowcaseTypes(imagesDB: Object) {
    this._showcaseTypesService.refreshshowcasesDb(imagesDB);
  }
  notifications = [];
  invitationsSent = [];
  invitationsReceived = [];
  processNotifications(imagesDB: Object) {
    this.invitationsReceived = imagesDB["people"]["invitations"]["received"];
    this.invitationsSent = imagesDB["people"]["invitations"]["sent"];
    let activeReceivedInvites = [];
    this.invitationsReceived.forEach(invitation => {
      if (invitation['status'] == "0") {
        activeReceivedInvites.push(invitation);
      }
    });
    if (activeReceivedInvites.length > 0) {
      this._notification.refreshNotifications(activeReceivedInvites);
    }

    // Begin sort images into showcase arrays & add image types to type array
    this.imageObjects.forEach(imgObj => {
      if (this.dbTypesArray.indexOf(imgObj.type) == -1) {
        this.dbTypesArray.push(imgObj.type);
      }
    });
  }
  openDialog() {
    this.dialog.open(DialogDefaultComponent);
  }
  edit(img) {
    if (this.db[this.myPosition[0]][this.myPosition[1]].isShared) {

    }
    else {
      let date = this.db[this.myPosition[0]][this.myPosition[1]].date;
      let desc = this.db[this.myPosition[0]][this.myPosition[1]].description;
      let comm = this.db[this.myPosition[0]][this.myPosition[1]].comment;
      let type = this.db[this.myPosition[0]][this.myPosition[1]].type;
      let image = this.db[this.myPosition[0]][this.myPosition[1]].image;
      let timestamp = this.db[this.myPosition[0]][this.myPosition[1]].timestamp;
      this.dialog.open(EditComponent, { data: { date: date, img: img, description: desc, comment: comm, type: type, timestamp: timestamp, image: image } });
    }
  }
  openVert(type) {
    // vert screen will use activeType to find the correct collection to show
    localStorage.setItem("activeType", type);
    this._router.navigate(['/vert']);
  }

}