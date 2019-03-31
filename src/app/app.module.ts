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
import { VertScrollComponent } from './vert-scroll/vert-scroll.component';
import { CustomersComponent } from './customers/customers.component';
import { LoginComponent } from './login/login.component';


import { FileUploadService } from './services/file-upload.service';
import { BehaviorSubjectService } from './services/behavior-subject.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { ShowcasesService } from './services/showcases.service';
import { AuthGuardService } from './services/auth-guard.service';

import { Config } from './config';
import { ReversePipe } from './pipes/reverse.pipe';

import { JwtHelper } from 'angular2-jwt';
import { WebsocketService } from './services/websocket.service';
import { ChatService } from './services/chat.service';
import { ChatComponent } from './chat/chat.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditImageComponent } from './edit-image/edit-image.component';
import { AccountComponent } from './account/account.component';
import { FriendsComponent } from './friends/friends.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationsService } from './services/notifications.service';
import { PeopleComponent } from './people/people.component';
import { InvitationsComponent } from './invitations/invitations.component';



const appRoutes: Routes = [
  {
    path: 'newacc',
    component: CreateAccountComponent,
    data: { title: 'NewAccount', animation: 'newacc' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home', animation: 'home' },
    canActivate: [AuthGuardService]
  },
  {
    path: 'upload',
    component: FileUploadComponent,
    data: { title: 'Upload', animation: 'upload' },
    canActivate: [AuthGuardService]
  },
  {
    path: 'vert',
    component: VertScrollComponent,
    data: { title: 'Vert', animation: 'vert' },
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "",
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [AuthGuardService]
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
    ReversePipe,
    VertScrollComponent,
    LoginComponent,
    CustomersComponent,
    ChatComponent,
    CreateAccountComponent,
    EditImageComponent,
    AccountComponent,
    FriendsComponent,
    NotificationComponent,
    PeopleComponent,
    InvitationsComponent
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
    , ShowcasesService
    , Config
    , HttpClient
    , ReversePipe
    , AuthGuardService
    , JwtHelper
    , WebsocketService
    , ChatService
    , ChatComponent,
    , NotificationsService

  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogDefaultComponent, EditComponent, ChatComponent, 
    EditImageComponent, AccountComponent, FriendsComponent, NotificationComponent
    ,InvitationsComponent, PeopleComponent
  ]
})
export class AppModule { }
