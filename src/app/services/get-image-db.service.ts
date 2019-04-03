import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class GetImageDbService {

  constructor(
    private http: HttpClient
  ) { }

  imagesDBObj: object = {};
  imagesDB = new BehaviorSubject<object>(this.updateDB());
  refreshImagesDB(): void {
    this.getImages().subscribe(imagesDB =>{
      this.imagesDBObj = imagesDB;
      this.imagesDB.next(this.imagesDBObj);
    })
  }
  private updateDB(): object {
    return this.imagesDBObj;
  }

  getImages() {
    var id = localStorage.getItem("acc");
    return this.http.get('https://switchmagic.com:4111/getImages?id=' + id);
  }
}
