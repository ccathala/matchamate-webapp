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
export class BoardCompanyComponent implements OnInit, OnDestroy {

  companyEmail: string;
  company: any;
  companySubscription: Subscription;
  isCompanyDataModificationInProgress = false;

  constructor(private userService: UserService,
              private tokenStorage: TokenStorageService,
              private companyApi: CompanyApiService,
              private geoApi: GeoApiService) {
    console.log('init board company');
              }


  ngOnInit(): void {
    this.companySubscription = this.companyApi.companySubject.subscribe(
      companyData => {
        this.company = companyData;
      },
      err => {
        console.error(err);
      }
    );

    this.companyApi.emitCompanySubject();
  }

  ngOnDestroy(): void {
    this.companySubscription.unsubscribe();
  }

  onSubmit(): void {

  }

  enableCompanyDataModification(): void {
    this.isCompanyDataModificationInProgress = true;
  }

  disableCompanyDataModification(): void {
    this.isCompanyDataModificationInProgress = false;
  }

  onDisableCompanyDataModificationInProgress(event: boolean): void {
    if (!event) {
      this.disableCompanyDataModification();
    }
  }

}
