import { SessionApiService } from './../../_services/_api/session-api.service';
import { TokenStorageService } from './../../_services/token-storage.service';
import { Component, OnInit, Input } from '@angular/core';
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-session-view',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  @Input()
  session: any;
  userEmail: string;
  bookedPlayers: any[];
  faPlus = faPlus;
  faTimesCircle = faTimesCircle;
  @Input()
  bookingEnabled: boolean;
  @Input()
  quitEnabled: boolean;
  userIsAlreadyBooked: boolean;
  isLoggedIn: boolean;

  constructor(private tokenStorage: TokenStorageService,
              private sessionApi: SessionApiService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getUser();
    if (this.isLoggedIn) {
      this.userEmail = this.tokenStorage.getUser().email;
    } else {
      this.userEmail = '';
    }


    this.bookedPlayers = this.session.participants.filter(e => e.email);
    this.userIsAlreadyBooked = this.session.participants.some(e => e.email === this.userEmail);
    this.session.id = this.sessionApi.getIdFromSessionRequest(this.session._links.self.href);
  }

  quitSession(session: any, email: string): void {
    const index = this.getUserIndexFromParticipants(session.participants, email);
    const id = session.id;
    const path = '/participants/' + index;
    const value = {};

    this.sessionApi.replaceSessionValue(id, path, value).subscribe(
      data => {
        console.log(data);
        this.deleteSessionIfNoParticipants(session);
        window.location.reload();
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
        const participants: any[]  = data.participants;
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

  addNewParticipantToSession()
}
