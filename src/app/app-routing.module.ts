import { PlayerGuardService } from './_services/player-guard.service';
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
  { path: 'company', component: BoardCompanyComponent},
  { path: 'admin', component: BoardAdminComponent},
  { path: 'profile', component: ProfileComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
