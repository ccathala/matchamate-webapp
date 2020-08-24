import { PlayerApiService } from './../_services/_api/player-api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board-player',
  templateUrl: './board-player.component.html',
  styleUrls: ['./board-player.component.scss']
})
export class BoardPlayerComponent implements OnInit, OnDestroy {

  playerEmail: string;
  player: any;
  playerSubscription: Subscription;
  isPlayerModificationInProgress = false;

  constructor(private playerApi: PlayerApiService) { }


  ngOnInit(): void {
    this.playerSubscription = this.playerApi.playerSubject.subscribe(
      playerData => {
        this.player = playerData;
      },
      err => {
        console.error(err);
      }
    );
    this.playerApi.emitPlayerSubject();
  }

  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }

  enablePlayerModification(): void {
    this.isPlayerModificationInProgress = true;
  }

  disablePlayerModification(): void {
    this.isPlayerModificationInProgress = false;
  }

  onDisablePlayerModificationInProgress(event: boolean): void {
    if (!event) {
      this.disablePlayerModification();
    }
  }

}
