import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';

import { AppComponent } from './app.component';
import { DialogDefaultComponent } from './dialog-default/dialog-default.component';
import { UploadComponent } from './upload/upload.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';

import { FileUploadService } from './services/file-upload.service';
import { BehaviorSubjectService } from './services/behavior-subject.service';
import { HttpInterceptorService } from './services/http-interceptor.service';

import { Config } from './config';
import { ReversePipe } from './pipes/reverse.pipe';


const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home', animation: 'home' }
  },
  {
    path: 'upload',
    component: FileUploadComponent,
    data: { title: 'Upload', animation: 'upload' }
  },
  {
    path: '',
    component: HomeComponent

  },
  {
    path: "",
    redirectTo: 'home',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AppComponent,
    DialogDefaultComponent,
    UploadComponent,
    FileUploadComponent,
    HomeComponent,
    EditComponent,
    ReversePipe
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
    , MatProgressSpinnerModule
    , HttpClientModule
    , MatCardModule
    , MatInputModule
    , MatSelectModule
    , FormsModule
    , ReactiveFormsModule,
    RouterModule.forRoot(appRoutes,
      { enableTracing: false, onSameUrlNavigation: 'reload' }
    )
  ],
  providers: [
    FileUploadService
    , BehaviorSubjectService
    , Config
    , HttpClient
    , ReversePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogDefaultComponent, EditComponent]
})
export class AppModule { }
