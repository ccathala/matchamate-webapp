import { PlayerApiService } from './../../_services/_api/player-api.service';
import { UtilsService } from './../../_services/utils.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-player-form',
  templateUrl: './data-player-form.component.html',
  styleUrls: ['./data-player-form.component.scss']
})
export class DataPlayerFormComponent implements OnInit, OnDestroy {

  playerId: string;
  player: any = {};
  playerSubscription: Subscription;
  @Input()
  isPlayerModificationInProgress: boolean;
  @Output()
  isPlayerModificationInProgressEvent = new EventEmitter<boolean>();

  playerModificationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    badmintonLevel: new FormControl('', [Validators.required]),
    avatarPicture: new FormControl(''),
    email: new FormControl('', [Validators.required]),
    subscribedSessionCount: new FormControl(''),
    leavedSessionCount: new FormControl('')
  });

  constructor(private utils: UtilsService,
              private playerApi: PlayerApiService) { }

  ngOnInit(): void {
    this.playerId = this.utils.getUserIdKey();
    this.playerSubscription = this.playerApi.playerSubject.subscribe(
      data => {
        this.player = data;
      },
      err => {
        console.error(err);
      }
    );
    this.playerApi.emitPlayerSubject();
    this.initPlayerModificationForm();
  }

  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }

  initPlayerModificationForm(): void {
    this.playerModificationForm.patchValue({
    firstName: this.player.firstName,
    lastName: this.player.lastName,
    gender: this.player.gender,
    badmintonLevel: this.player.badmintonLevel,
    avatarPicture: this.player.avatarPicture,
    email: this.player.email,
    subscribedSessionCount: this.player.subscribedSessionCount,
    leavedSessionCount: this.player.leavedSessionCount,
    });
  }

  onSubmit(): void {
    this.playerApi.fullyUpdatePlayer(this.playerModificationForm.value, this.playerId).subscribe(
      data => {
        this.playerApi.getPlayerByEmail(data.email, () => {
          this.disablePlayerModificationInProgress();
        });
      },
      err => {
        console.error(err);
      }
    );
  }

  disablePlayerModificationInProgress(): void {
    this.isPlayerModificationInProgressEvent.emit(false);
  }
}
