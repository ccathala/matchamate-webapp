import { SessionApiService } from './../_services/_api/session-api.service';
import { GeoApiService } from './../_services/_api/geo-api.service';
import { CompanyApiService } from './../_services/_api/company-api.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board-company',
  templateUrl: './board-company.component.html',
  styleUrls: ['./board-company.component.scss']
})
export class BoardCompanyComponent implements OnInit {

  sessions: any[];

  constructor(private tokenStorage: TokenStorageService,
              private sessionApi: SessionApiService) { }

  ngOnInit(): void {
    const email = this.tokenStorage.getUser().email;
    this.sessionApi.getSessionsByCompanyEmail(email).subscribe(
      data => {
        this.sessions = data._embedded.sessions;
      },
      err => {
        console.error(err);
      }
    );

  }
}
