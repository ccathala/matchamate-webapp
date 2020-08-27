import { SessionApiService } from './../../_services/_api/session-api.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-booked-sessions',
  templateUrl: './booked-sessions.component.html',
  styleUrls: ['./booked-sessions.component.scss']
})
export class BookedSessionsComponent implements OnInit, OnChanges {

  @Input()
  sessions: any[];
  bookedSessions: any[];
  bookingEnabled: boolean;
  quitEnabled: boolean;

  constructor(private sessionApi: SessionApiService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('execute onChange');
    if (this.sessions) {
      this.extractBookedSessionsFromSessions();
    }
  }

  ngOnInit(): void {
    console.log('sessions from booked session');
    console.log(this.sessions);
    this.bookingEnabled = false;
    this.quitEnabled = true;
    console.log(this.bookedSessions);
  }

  extractBookedSessionsFromSessions(): void {
    this.bookedSessions = [];
    for (const session of this.sessions) {
      if (!session.isDone) {
        session.id = this.sessionApi.getIdFromSessionRequest(session._links.self.href);
        this.bookedSessions.push(session);
      }
    }
  }

}
