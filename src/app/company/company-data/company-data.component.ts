import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyApiService } from 'src/app/_services/_api/company-api.service';

@Component({
  selector: 'app-company-data',
  templateUrl: './company-data.component.html',
  styleUrls: ['./company-data.component.scss']
})
export class CompanyDataComponent implements OnInit, OnDestroy {

  companyEmail: string;
  company: any;
  companySubscription: Subscription;
  isCompanyDataModificationInProgress = false;

  constructor(private companyApi: CompanyApiService) {}

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
