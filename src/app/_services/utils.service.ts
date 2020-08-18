import { PlayerApiService } from './_api/player-api.service';
import { CompanyApiService } from './_api/company-api.service';
import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';

const ID_KEY = 'user-id';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  href: string;
  id: string;

  constructor(private companyApi: CompanyApiService,
              private playerApi: PlayerApiService) {
    console.log('init Utils service');
               }

  saveUserIdKey(userId: string): void {
    window.localStorage.removeItem(ID_KEY);
    window.localStorage.setItem(ID_KEY, userId);
  }

  getUserIdKey(): string {
    return localStorage.getItem(ID_KEY);
  }

  async getUserFromApis(roles: string[], email: string, onSuccess: () => void): Promise<any> {
    if (roles.includes('ROLE_COMPANY')) {
      this.companyApi.getCompanyByEmail(email, () => {
        onSuccess();
      });
    } else if (roles.includes('ROLE_PLAYER')) {
      this.playerApi.getPlayerByEmail(email, () => {
        onSuccess();
      });
    }
  }

  getIdFromHref(roles: string[], href: string): string {
    if (roles.includes('ROLE_COMPANY')) {
      return href.substring(32);
    } else if (roles.includes('ROLE_PLAYER')) {
      return href.substring(30);
    }
  }

  getSubscriptionByRole(roles: string[]): Subject<any> {
    if (roles.includes('ROLE_COMPANY')) {
      return this.companyApi.companySubject;
    } else if (roles.includes('ROLE_PLAYER')) {
      return this.playerApi.playerSubject;
    }
  }
}
