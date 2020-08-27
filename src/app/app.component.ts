import { GeoApiService } from 'src/app/_services/_api/geo-api.service';
import { CompanyApiService } from 'src/app/_services/_api/company-api.service';
import { Router } from '@angular/router';
import { UtilsService } from './_services/utils.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';


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

  constructor(private tokenStorageService: TokenStorageService,
              private utils: UtilsService,
              private companyApi: CompanyApiService,
              private geoApi: GeoApiService) { }


  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
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

      this.companyListSubscription = this.companyApi.companyListSubject.subscribe(
        data => {
          this.companyList = data;
        },
        err => {
          console.error(err);
        }
      );
      this.companyApi.getCompanies(() => { });
    }
    this.companyApi.emitCompanyListSubject();
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
}
