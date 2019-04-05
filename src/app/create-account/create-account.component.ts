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
  ) { }
  invalidLogin;
  apiEndPoint = this._config.urls.apiEndPoint;
  @ViewChild('password') password: ElementRef;
  @ViewChild('confirmPassword') confirmPassword: ElementRef;
  @ViewChild('userName') userName: ElementRef;
  @ViewChild('email') email: ElementRef;
  loginMessage;
  loading = false;
  ngOnInit() {
    this.loginMessage = document.getElementById('loginMessage');
  }

  createAccount(form: NgForm) {
    this.loginMessage.innerHTML = "";
    let credentials = JSON.stringify(form.value);
    if (this.password.nativeElement.value != '' && this.confirmPassword.nativeElement.value != '') {
      if (this.password.nativeElement.value == this.confirmPassword.nativeElement.value) {
        if (this.userName.nativeElement.value !== '' && this.email.nativeElement.value !== '') {
          this.loading = true;
          this._httpClient.post('https://switchmagic.com/api/values', credentials
            , {
              headers: new HttpHeaders({
                "Content-Type": "application/json"
              })
            }
          )
            .subscribe(
              (res) => {
                
                var status = res["status"];
                if(status != "success"){
                  this.loginMessage.innerHTML = status;        
                }
                this.createDB(res["userNumber"],form);
                // this.disabled = true;
                // this._behaviorSubject.refreshImagesDB('refresh');
                //this._router.navigate(['/home']);
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
  createDB(id, form) {
    this._httpClient.get('https://switchmagic.com:4111/createdb?id=' + id)
      .subscribe(response => {
        localStorage.setItem("acc",id);
        this.login(form);
        
      });
  }
  login(form: NgForm){
    let credentials = JSON.stringify(form.value);
    let loginVals = form.value;
    //credentials:  {"username":"jpjpiesco@gmail.com","password":"mebloggy123$"}
    let loginObject = { username: loginVals["email"], password: loginVals["password"]  };
    this._httpClient.post("https://switchmagic.com/api/auth/login", loginObject, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      let token = (<any>response).token;
      localStorage.setItem("jwt", token);
      let userNumber = (<any>response).userNumber;
      localStorage.setItem("acc", userNumber);
      this.loading = false;
      //this.invalidLogin = false;
      this._router.navigate(["/home"]);
    }, err => {
      //this.invalidLogin = true;
    });
  }
  showhide = true;
  showhidepassword() {
    if (this.showhide) {
      this.password.nativeElement.type = "text";
      this.confirmPassword.nativeElement.type = "text";
    }
    else {
      this.password.nativeElement.type = "password";
      this.confirmPassword.nativeElement.type = "password";
    }
    this.showhide = !this.showhide;
  }
}
