import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogDefaultComponent } from './dialog-default/dialog-default.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { trigger, state, style, animate, transition, query } from '@angular/animations';
import { AccountComponent } from './account/account.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationsService } from './services/notifications.service';
import { AuthGuardService } from './services/auth-guard.service';

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
export class AppComponent implements OnInit {

  title = 'meBloggy';
  db = [];
  constructor(
    iconRegistry: MatIconRegistry
    , sanitizer: DomSanitizer
    , public dialog: MatDialog
    , public _noification: NotificationsService
    , private _authService: AuthGuardService
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
    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/delete.svg'));
    iconRegistry.addSvgIcon(
      'list',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/list.svg'));
    iconRegistry.addSvgIcon(
      'menu2',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/menu2.svg'));
    iconRegistry.addSvgIcon(
      'visible',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/visibility.svg'));
    iconRegistry.addSvgIcon(
      'visibleoff',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/visibility_off.svg'));
    iconRegistry.addSvgIcon(
      'people',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/people.svg'));
    iconRegistry.addSvgIcon(
      'person_add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/person_add.svg'));
    iconRegistry.addSvgIcon(
      'thumb_up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/thumb_up.svg'));
    iconRegistry.addSvgIcon(
      'notifications_active',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/notifications_active.svg'));
    iconRegistry.addSvgIcon(
      'notifications',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/notifications.svg'));
  }
  isInit = true;
  ngOnInit() {
    this._noification.notification.subscribe(notify => {
      console.log("notify: ", notify);
      if (!this.isInit) {
        this.dialog.open(NotificationComponent, { data: { notify: notify } });
      }
    });
    this.isInit = false;
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
  openAccount() {
    if (this._authService.canActivate()) {
      this.dialog.open(AccountComponent);
    }
  }
}
