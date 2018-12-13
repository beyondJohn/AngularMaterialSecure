import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogDefaultComponent } from './dialog-default/dialog-default.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { trigger, state, style, animate, transition, query } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routerAnimation', [
      transition('* <=> *', [
        // Initial state of new route
        query(':enter',
          style({
            position: 'fixed',
            width: '100%',
            height: '100%',
            opacity: 0,
            transform: 'translateX(-100%)'
          }),
          { optional: true }),
        // move page off screen right on leave
        query(':leave',
          animate('400ms ease',
            style({
              position: 'fixed',
              width: '100%',
              height: '100%',
              opacity: 0,
              transform: 'translateX(100%)'
            })
          ),
          { optional: true }),
        // move page in screen from left to right
        query(':enter',
          animate('400ms ease',
            style({
              opacity: 1,
              transform: 'translateX(0%)'
            })
          ),
          { optional: true }),
      ])
    ])
  ]
})
export class AppComponent {
  title = 'meBloggy';
  db = ["../assets/img/kidsSkating.jpg", "../assets/img/kidsSkating2.jpg", "../assets/img/kidsSkating5.jpg",
    "../assets/img/kidsSkating3.jpg", "../assets/img/kidsSkating4.jpg"];
  constructor(
    iconRegistry: MatIconRegistry
    , sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/thumbup-icon.svg'));
    iconRegistry.addSvgIcon(
      'dialpad',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/dialpadSharp.svg'));
    iconRegistry.addSvgIcon(
      'voicemail',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/voicemailSharp.svg'));
    iconRegistry.addSvgIcon(
      'notification',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/notification.svg'));
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/menu.svg'));
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/home.svg'));
    iconRegistry.addSvgIcon(
      'upload',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/upload.svg'));
    iconRegistry.addSvgIcon(
      'settings',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/settings.svg'));
    iconRegistry.addSvgIcon(
      'account',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/account.svg'));
  }
  myPosition = 0;
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
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
}
