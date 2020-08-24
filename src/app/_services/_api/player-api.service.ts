import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const PLAYER_API = 'http://localhost:8084/matchamate-player-api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PlayerApiService {

  player: any;
  playerSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  emitPlayerSubject(): void {
    this.playerSubject.next(this.player);
  }

  getPlayerByEmail(email: string, onSuccess: () => void): void {
    this.http.get(PLAYER_API
      + 'players/search/findByEmail?email='
      + email).subscribe(
        data => {
          this.player = data;
          this.emitPlayerSubject();
          onSuccess();
        },
        err => {
          console.error(err);
        }
      );
  }

  registerPlayer(player): Observable<any> {
      player.avatarPicture = '/pictures/default.png';
      player.subscribedSessionCount =  0;
      player.leavedSessionCount =  0;
      return this.http.post(PLAYER_API + 'players',
      player,
      httpOptions
      );
  }

  fullyUpdatePlayer(player: any, id: string): Observable<any> {
    return this.http.put(PLAYER_API
      + 'players/' + id,
      player,
      httpOptions);
  }

  deletePlayerByEmail(email): Observable<any>{
    return this.http.get(
      PLAYER_API
      + 'players/search/deleteByEmail?email='
      + email);
  }
}
