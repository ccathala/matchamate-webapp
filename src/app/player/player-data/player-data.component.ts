import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerApiService } from 'src/app/_services/_api/player-api.service';

@Component({
  selector: 'app-player-data',
  templateUrl: './player-data.component.html',
  styleUrls: ['./player-data.component.scss']
})
export class PlayerDataComponent implements OnInit, OnDestroy {

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
