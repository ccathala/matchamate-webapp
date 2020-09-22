import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardPlayerComponent } from './board-player/board-player.component';
import { BoardCompanyComponent } from './board-company/board-company.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { DataCompanyFormComponent } from './_forms/data-company-form/data-company-form.component';
import { DataPlayerFormComponent } from './_forms/data-player-form/data-player-form.component';
import { CreateSessionComponent } from './create-session/create-session.component';
import { CreateSessionFormComponent } from './_forms/create-session-form/create-session-form.component';
import { DatePipe } from '@angular/common';
import { BookedSessionsComponent } from './player/booked-sessions/booked-sessions.component';
import { PlayedSessionsComponent } from './player/played-sessions/played-sessions.component';
import { PlayerDataComponent } from './player/player-data/player-data.component';
import { SessionComponent } from './views/session/session.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompanyBookedSessionsComponent } from './company/company-booked-sessions/company-booked-sessions.component';
import { CompanyPlayedSessionsComponent } from './company/company-played-sessions/company-played-sessions.component';
import { CompanyDataComponent } from './company/company-data/company-data.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardPlayerComponent,
    BoardCompanyComponent,
    DataCompanyFormComponent,
    DataPlayerFormComponent,
    CreateSessionComponent,
    CreateSessionFormComponent,
    BookedSessionsComponent,
    PlayedSessionsComponent,
    PlayerDataComponent,
    SessionComponent,
    CompanyBookedSessionsComponent,
    CompanyPlayedSessionsComponent,
    CompanyDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    FontAwesomeModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    CollapseModule.forRoot()
  ],
  providers: [authInterceptorProviders, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
