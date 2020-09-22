import { AuthService } from './_services/auth.service';
import { GeoApiService } from 'src/app/_services/_api/geo-api.service';
import { CompanyApiService } from 'src/app/_services/_api/company-api.service';
import { Router } from '@angular/router';
import { UtilsService } from './_services/utils.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showPlayerBoard = false;
  showCompanyBoard = false;
  showCreateSession = false;
  email: string;
  id: string;
  href: string;
  user: any;
  userSubscription: Subscription;
  companyList: any[];
  companyListSubscription: Subscription;
  token: string;
  tokenIsValid: boolean;
  tokenValidationDone = false;
  isCollapsed = true;

  // idle timer var
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';

  constructor(private tokenStorageService: TokenStorageService,
              private utils: UtilsService,
              private companyApi: CompanyApiService,
              private geoApi: GeoApiService,
              private idle: Idle,
              private keepalive: Keepalive,
              private auth: AuthService) { }


  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {

      this.token = this.tokenStorageService.getToken();
      this.validateToken(() => {
          this.refreshToken();
          setInterval( () => this.refreshToken(), 840000);
          this.tokenValidationDone = true;
      });


      const userAuth = this.tokenStorageService.getUser();
      this.roles = userAuth.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');

      if (this.roles.includes('ROLE_PLAYER')) {
        this.showPlayerBoard = true;
        this.showCreateSession = true;
      } else {
        this.showPlayerBoard = false;
        this.showCreateSession = false;
      }

      this.showCompanyBoard = this.roles.includes('ROLE_COMPANY');
      this.email = userAuth.email;





      if (this.roles.includes('ROLE_COMPANY') || this.roles.includes('ROLE_PLAYER')) {
        this.userSubscription = this.utils.getSubscriptionByRole(this.roles).subscribe(
          data => {
            this.user = data;
          },
          err => {
            console.error(err);
          }
        );

        this.utils.getUserFromApis(this.roles, this.email, () => {
          if (!(!!this.utils.getUserIdKey())) {
            this.href = this.user._links.self.href;
            this.id = this.utils.getIdFromHref(this.roles, this.href);
            this.utils.saveUserIdKey(this.id);
          }
        });
      }

      // Set idle timer

      // sets an idle timeout of 5 seconds, for testing purposes.
      this.idle.setIdle(5);
      // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      this.idle.setTimeout(780000);
      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      this.idle.onIdleEnd.subscribe(() => {
        this.idleState = 'No longer idle.';
        console.log(this.idleState);
        this.reset();
      });

      this.idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        console.log(this.idleState);
        this.logout();
      });

      this.idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!';
        console.log(this.idleState);
      });

      this.idle.onTimeoutWarning.subscribe((countdown) => {
        this.idleState = 'You will time out in ' + countdown + ' seconds!';
        console.log(this.idleState);
      });


      // sets the ping interval to 15 seconds
      this.keepalive.interval(15);

      this.keepalive.onPing.subscribe(() => {
        // this.lastPing = new Date()
        console.log('ping');
      });
      this.reset();


    }
    this.companyApi.getCompanies(() => { });
    this.geoApi.getDepartementList(() => { });
    this.geoApi.getRegionList(() => { });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.companyListSubscription.unsubscribe();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  reset(): void {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  refreshToken(): void {
    this.auth.refreshToken(this.token).subscribe(
      data => {
        this.tokenStorageService.saveToken(data.token);
        this.token = data.token;
      },
      err => {
        console.error(err);
      }
    );
  }

  validateToken(onSuccess: () => void): void {
    this.auth.validateToken(this.token).subscribe(
      data => {
        this.tokenIsValid = data;
        onSuccess();
      },
      err => {
        this.logout();
      }
    );
  }
}
