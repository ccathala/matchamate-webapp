import { TokenStorageService } from './../_services/token-storage.service';
import { SessionApiService } from './../_services/_api/session-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-player',
  templateUrl: './board-player.component.html',
  styleUrls: ['./board-player.component.scss']
})
export class BoardPlayerComponent implements OnInit {

  sessions: any[];

  constructor(private sessionApi: SessionApiService,
              private tokenStorage: TokenStorageService) { }


  ngOnInit(): void {
    const email = this.tokenStorage.getUser().email;
    this.sessionApi.getSessionsByPlayerEmail(email).subscribe(
      data => {
        this.sessions = data._embedded.sessions;
        console.log('session initialized');
      },
      err => {
        console.error(err);
      }
    );

  }
}
