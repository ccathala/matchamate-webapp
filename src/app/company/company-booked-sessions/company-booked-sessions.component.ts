import { SessionApiService } from './../../_services/_api/session-api.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-company-booked-sessions',
  templateUrl: './company-booked-sessions.component.html',
  styleUrls: ['./company-booked-sessions.component.scss']
})
export class CompanyBookedSessionsComponent implements OnInit, OnChanges {

  @Input()
  sessions: any [];
  bookedSessions: any[];
  bookingEnabled: boolean;
  quitEnabled: boolean;
  bookedSessionPage: boolean;
  constructor(private sessionApi: SessionApiService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sessions) {
      this.extractBookedSessionsFromSessions();
    }
  }

  ngOnInit(): void {
    this.bookingEnabled = false;
    this.quitEnabled = false;
    this.bookedSessionPage = true;
  }

  extractBookedSessionsFromSessions(): void {
    this.bookedSessions = [];
    for (const session of this.sessions) {
      if (!session.isDone && session.isFull) {
        session.id = this.sessionApi.getIdFromSessionRequest(session._links.self.href);
        this.bookedSessions.push(session);
      }
    }
  }

}
