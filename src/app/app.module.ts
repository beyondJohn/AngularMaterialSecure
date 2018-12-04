import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { DialogDefaultComponent } from './dialog-default/dialog-default.component';


@NgModule({
  declarations: [
    AppComponent,
    DialogDefaultComponent
  ],
  imports: [
    BrowserModule
    , BrowserAnimationsModule
    , MatButtonModule
    , MatCheckboxModule
    , MatToolbarModule
    , MatDialogModule
    , MatMenuModule
    , MatIconModule
    , HttpClientModule
    , MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogDefaultComponent]
})
export class AppModule { }
