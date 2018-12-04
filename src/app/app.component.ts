import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogDefaultComponent } from './dialog-default/dialog-default.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meBloggy';
  db = ["../assets/img/kidsSkating.jpg", "../assets/img/kidsSkating2.jpg", "../assets/img/kidsSkating5.jpg",
    "../assets/img/kidsSkating3.jpg", "../assets/img/kidsSkating4.jpg"];
  constructor(
    public dialog: MatDialog
    , iconRegistry: MatIconRegistry
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
  }
  myPosition = 0;
  myImg() {
      return this.db[this.myPosition];
  }
  updateImg(i){
    this.myPosition = i;
    console.log("hello" + i);
    
    var top = document.getElementById("card").offsetTop + 120; //Getting Y of target element
    console.log("offset" + top);
    window.scrollTo(200, top);  
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogDefaultComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
