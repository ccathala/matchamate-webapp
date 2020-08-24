import { CreateSessionComponent } from './create-session/create-session.component';
import { AdminGuardService } from './_services/_auth-guard/admin-guard.service';
import { PlayerGuardService } from './_services/_auth-guard/player-guard.service';
import { CompanyGuardService } from './_services/_auth-guard/company-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardCompanyComponent } from './board-company/board-company.component';
import { BoardPlayerComponent } from './board-player/board-player.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'signin', component: LoginComponent},
  { path: 'signup', component: RegisterComponent},
  { path: 'player', canActivate: [PlayerGuardService], component: BoardPlayerComponent},
  { path: 'company', canActivate: [CompanyGuardService], component: BoardCompanyComponent},
  { path: 'admin', canActivate: [AdminGuardService], component: BoardAdminComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'create-session', canActivate: [PlayerGuardService], component: CreateSessionComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
