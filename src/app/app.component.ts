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
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDefaultComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
