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
  email: string;
  id: string;
  href: string;
  user: any;
  userSubscription: Subscription;

  constructor(private tokenStorageService: TokenStorageService,
    private utils: UtilsService,
    private router: Router,
    private companyApi: CompanyApiService) {
    console.log('init app component');
  }


  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const userAuth = this.tokenStorageService.getUser();
      this.roles = userAuth.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showPlayerBoard = this.roles.includes('ROLE_PLAYER');
      this.showCompanyBoard = this.roles.includes('ROLE_COMPANY');

      this.email = userAuth.email;

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
  }

  ngOnDestroy(): void {
    console.log('Unsubscribe');
    this.userSubscription.unsubscribe();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
