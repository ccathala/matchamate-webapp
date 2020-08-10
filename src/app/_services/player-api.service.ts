import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const PLAYER_API = 'http://localhost:8084/matchamate-player-api/';
// const PLAYER_API = 'http://localhost:8085/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PlayerApiService {

  constructor(private http: HttpClient) { }

  registerPlayer(player): Observable<any> {
    return this.http.post(PLAYER_API + 'players', {
      email: player.email,
      avatarPicture: '/pictures/default.png',
      firstName: player.firstName,
      lastName: player.lastName,
      gender: player.gender,
      badmintonLevel: player.badmintonLevel,
      subscribedSessionCount: 0,
      leavedSessionCount: 0
    },
    httpOptions
    );
  }

  deletePlayerByEmail(email): Observable<any>{
    return this.http.get(
      PLAYER_API
      + 'players/search/deleteByEmail?email='
      + email);
  }
}
