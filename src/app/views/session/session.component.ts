import { Subscription } from 'rxjs';
import { PlayerApiService } from './../../_services/_api/player-api.service';
import { SessionApiService } from './../../_services/_api/session-api.service';
import { TokenStorageService } from './../../_services/token-storage.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faPlus, faTimesCircle, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-session-view',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit, OnDestroy {

  @Input()
  session: any;
  userEmail: string;
  userRole: string;
  bookedPlayers: any[];
  faPlus = faPlus;
  faTimesCircle = faTimesCircle;
  faTimes = faTimes;
  faLock = faLock;
  @Input()
  bookingEnabled: boolean;
  @Input()
  quitEnabled: boolean;
  userIsAlreadyBooked: boolean;
  isLoggedIn: boolean;
  sessionIsLock = false;
  player: any;
  playerSubcription: Subscription;
  playerLevelValue: number;
  sessionLevelValue: number;
  @Input()
  bookedSessionPage: boolean;
  displayAnnulationTemplate: boolean;

  constructor(private tokenStorage: TokenStorageService,
    private sessionApi: SessionApiService,
    private playerApi: PlayerApiService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getUser();
    if (this.isLoggedIn) {
      this.userEmail = this.tokenStorage.getUser().email;
      this.userRole = this.tokenStorage.getUser().roles[0];
    } else {
      this.userEmail = '';
      this.userRole = '';
    }

    // Get session booked players
    this.bookedPlayers = this.session.participants.filter(e => e.email);

    // Check if user is already booked
    this.userIsAlreadyBooked = this.session.participants.some(e => e.email === this.userEmail);

    // Get session id
    this.session.id = this.sessionApi.getIdFromSessionRequest(this.session._links.self.href);

    // If user has Player role declare player subscription
    if (this.userRole === 'ROLE_PLAYER') {
      this.playerSubcription = this.playerApi.playerSubject.subscribe(
        data => {
          this.player = data;
          if (this.player) {
            this.playerLevelValue = this.setLevelValue(this.player.badmintonLevel);
          }
        },
        err => {
          console.error(err);
        }
      );
      this.playerApi.emitPlayerSubject();
    }

    this.sessionLevelValue = this.setLevelValue(this.session.badmintonRequiredLevel);
    this.displayAnnulationTemplate = false;

    if (this.session.isLocked) {
      this.quitEnabled = false;
      this.sessionIsLock = true;
    }
  }

  ngOnDestroy(): void {
    // If user has Player role unsubscribe player subscription
    if (this.userRole === 'ROLE_PLAYER') {
      this.playerSubcription.unsubscribe();
    }
  }

  quitSession(session: any, email: string): void {
    const index = this.getUserIndexFromParticipants(session.participants, email);
    const id = session.id;
    const path = '/participants/' + index;
    const value = {};

    // Update participants list
    this.sessionApi.replaceSessionValue(id, path, value).subscribe(
      data => {
        console.log(data);
        // Update isFull to false
        this.sessionApi.replaceSessionValue(id, 'isFull', false).subscribe(
          dataIsFull => {
            console.log(dataIsFull);
            this.deleteSessionIfNoParticipants(session);
            window.location.reload();
          },
          errIsFull => {
            console.error(errIsFull);
          }
        );

      },
      err => {
        console.error(err);
      }
    );


  }

  getUserIndexFromParticipants(participants: [], email: string): number {
    let index: number;
    for (let i = 0; i < participants.length; i++) {
      const participant: any = participants[i];
      if (participant.email === email) {
        index = i;
      }
    }
    return index;
  }

  deleteSessionIfNoParticipants(session: any): void {
    this.sessionApi.getSessionById(session.id).subscribe(
      data => {
        const participants: any[] = data.participants;
        if (!participants.some(e => e.email)) {
          this.sessionApi.deleteSessionById(session.id).subscribe(
            dataOnDelete => {
              console.log(dataOnDelete);
            },
            errOnDelete => {
              console.error(errOnDelete);
            }
          );
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  addNewParticipantToSession(): void {

    // Check if player is already bboked
    const participants = this.session.participants;
    const isUserAlreadyBooked = participants.some(e => e.email === this.userEmail);

    if (isUserAlreadyBooked) {
      console.error('L\'utilisateur est déjà inscrit à la session');
    } else {


      // Declare variables needed to add player to session
      const emptyPlayerSlotIndex = this.getEmptyPlayerSlotIndex(participants);
      const id = this.sessionApi.getIdFromSessionRequest(this.session._links.self.href);
      const path = '/participants/' + emptyPlayerSlotIndex;
      const value = this.player;

      // Add player to session
      this.sessionApi.replaceSessionValue(id, path, value).subscribe(
        data => {
          console.log(data);
          this.checkIfSessionIsFull(data.participants);
          window.location.reload();
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  getEmptyPlayerSlotIndex(participants: any[]): number {
    let playerSlotIndex;
    let emptyPlayerSlotFound = false;

    // Get empty player slot index
    while (!emptyPlayerSlotFound) {
      for (let index = 0; index < participants.length; index++) {
        const element = participants[index];
        if (!element.email) {
          playerSlotIndex = index;
          emptyPlayerSlotFound = true;
        }
      }
    }
    return playerSlotIndex;
  }

  setLevelValue(levelString: string): number {
    if (levelString === 'Débutant') {
      return 0;
    } else if (levelString === 'Régulier') {
      return 1;
    } else {
      return 2;
    }
  }

  checkIfSessionIsFull(participants: any[]): void {
    const maxPlayersNumber = participants.length;
    const bookedParticipantsList: any[] = participants.filter(e => !!e.email);

    if (bookedParticipantsList.length === maxPlayersNumber) {
      this.setSessionFull();
    }
  }

  setSessionFull(): void {
    // Declare variables needed to add player to session
    const id = this.sessionApi.getIdFromSessionRequest(this.session._links.self.href);
    const path = '/isFull';
    const value = true;

    // Add player to session
    this.sessionApi.replaceSessionValue(id, path, value).subscribe(
      data => {
        console.log(data);
        window.location.reload();
      },
      err => {
        console.error(err);
      }
    );
  }

  enableAnnulationTemplate(): void {
    this.displayAnnulationTemplate = true;
  }

  disableAnnulationTemplate(): void {
    this.displayAnnulationTemplate = false;
  }

  cancelReservation(sessionId: string, motif: string): void {
    this.sessionApi.reservationCancel(sessionId, motif, this.session).subscribe(
      data => {
        console.log(data);
        window.location.reload();
      },
      err => {
        console.error(err);
      }
    );
  }


}
