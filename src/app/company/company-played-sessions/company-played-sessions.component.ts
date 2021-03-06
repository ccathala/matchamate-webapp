import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-company-played-sessions',
  templateUrl: './company-played-sessions.component.html',
  styleUrls: ['./company-played-sessions.component.scss']
})
export class CompanyPlayedSessionsComponent implements OnInit, OnChanges {

  @Input()
  sessions: any[];
  doneSessions: any[];
  bookingEnabled: boolean;
  quitEnabled: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sessions) {
     this.extractDoneSessionsFromSessions();
    }
  }

  ngOnInit(): void {
    this.bookingEnabled = false;
    this.quitEnabled = false;
    console.log(this.doneSessions);
  }


  extractDoneSessionsFromSessions(): void {
    this.doneSessions = [];
    for (const session of this.sessions) {
      if (session.isDone && session.isPlayed) {
        this.doneSessions.push(session);
      }
    }
  }

}
