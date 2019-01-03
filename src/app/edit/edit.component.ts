import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config'

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

  }

  ngOnInit() {
    console.log('data: ', this.data);
  }
  delete(img) {
    const data = img.data.img;
    //this._httpClient.delete(this._config.urls.apiEndPoint)
    console.log('img.data.img: ', img.data.img);
  }
}
