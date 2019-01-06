import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config';

export interface Showcase {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    , private _httpClient: HttpClient
    , private _config: Config
  ) {
    this.selectedValue = this.data.type;
  }
  selectedValue: string;
  showcases: Showcase[] = [
    { value: '0', viewValue: 'Family' },
    { value: '1', viewValue: 'Friends' },
    { value: '2', viewValue: 'Fun' },
    { value: '3', viewValue: 'Food' },
    { value: '4', viewValue: 'Nature' }
  ];
  ngOnInit() {
    console.log('data: ', this.data);
  }
  delete(img) {
    const data = img.data.img;
    // this._httpClient.delete(this._config.urls.deleteAPI,img).subscribe(result => {
    //   console.log('result: ', result);
    // });
    this._httpClient.get('https://switchmagic.com:4111/getimages').subscribe(result => {
      console.log('result: ', result);
    });
    // console.log('img.data.img: ', img.data.img);
  }
}
