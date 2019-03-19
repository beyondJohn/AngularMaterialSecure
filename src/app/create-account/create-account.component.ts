import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../config';
import { HttpResponse } from 'selenium-webdriver/http';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor(
    private _httpClient: HttpClient
    , private _router: Router
    , private _config: Config
  ) {  }
  invalidLogin;
  apiEndPoint = this._config.urls.apiEndPoint;
  @ViewChild('password') password: ElementRef;
  @ViewChild('confirmPassword') confirmPassword: ElementRef;
  @ViewChild('userName') userName: ElementRef;
  @ViewChild('email') email: ElementRef;
  loginMessage;
  
  ngOnInit() {
    this.loginMessage = document.getElementById('loginMessage');
  }

  login(form: NgForm) {
    this.loginMessage.innerHTML = "";
    let credentials = JSON.stringify(form.value);
    if (this.password.nativeElement.value != '' && this.confirmPassword.nativeElement.value != '') {
      if (this.password.nativeElement.value == this.confirmPassword.nativeElement.value) {
        if (this.userName.nativeElement.value !== '' && this.email.nativeElement.value !== '') {
          this._httpClient.post('http://localhost:50983/api/values', credentials
            , {
              headers: new HttpHeaders({
                "Content-Type": "application/json"
              }),
              reportProgress: true,
              observe: 'events'
            }
          )
            .subscribe(
              (event) => {
                console.log(event);
                console.log('checking for body' + event['body']);
                if (event['type'] == 1 && event['loaded'] && event['total']) {
                  let percent = 100 - Math.round(parseFloat(event['total']) / parseFloat(event['loaded']));
                  console.log(percent);
                  //that.value = percent;
                  //percent > 98 ? document.getElementById('complete').innerText = 'COMPLETING...' : document.getElementById('complete').innerText = percent + '% COMPLETE';
                }
                else if (event['type'] > 1) {
                  if (event['body'] !== undefined) {
                    console.log("event['body']: ", event['body']);
                  }
                  // this.loading = false;
                  // this.disabled = true;
                  // this._behaviorSubject.refreshImagesDB('refresh');
                  this._router.navigate(['/home']);
                }
              },
              err => console.log(err)
            );
        }
        else {
          this.loginMessage.innerHTML = "Please complete before submitting";
          return;
        }
      }
      else {
        this.invalidLogin = true;
        this.loginMessage.innerHTML = "Passwords don't match.";
        return;
      }
    }
    else {
      this.loginMessage.innerHTML = "Please complete before submitting";
      return;
    }
  }
}
