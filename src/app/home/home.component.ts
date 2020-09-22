import { AuthService } from './../_services/auth.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { DatePipe } from '@angular/common';
import { SessionApiService } from './../_services/_api/session-api.service';
import { CompanyApiService } from './../_services/_api/company-api.service';
import { GeoApiService } from './../_services/_api/geo-api.service';
import { Departement } from './../_models/departement';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Region } from '../_models/region';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  selectedRegionCode = '';
  selectedDepartementCode = '';
  selectedCompany = '';
  selectedHourMin = 0;
  selectedHourMax = 23;
  selectedLevel = '';
  selectedDate: Date[];
  sessions: any[];
  minDate: Date = new Date();


  hours = [
    { display: '00:00', value: 0 },
    { display: '01:00', value: 1 },
    { display: '02:00', value: 2 },
    { display: '03:00', value: 3 },
    { display: '04:00', value: 4 },
    { display: '05:00', value: 5 },
    { display: '06:00', value: 6 },
    { display: '07:00', value: 7 },
    { display: '08:00', value: 8 },
    { display: '09:00', value: 9 },
    { display: '10:00', value: 10 },
    { display: '11:00', value: 11 },
    { display: '12:00', value: 12 },
    { display: '13:00', value: 13 },
    { display: '14:00', value: 14 },
    { display: '15:00', value: 15 },
    { display: '16:00', value: 16 },
    { display: '17:00', value: 17 },
    { display: '18:00', value: 18 },
    { display: '19:00', value: 19 },
    { display: '20:00', value: 20 },
    { display: '21:00', value: 21 },
    { display: '22:00', value: 22 },
    { display: '23:00', value: 23 }
  ];
  hoursMin: any[];
  hoursMax: any[];

  regionList: Region[];
  regionListSubscription: Subscription;
  departementList: Departement[];
  queriedDepartementList: Departement[];
  departementListSubscription: Subscription;
  companyList: any[];
  queriedCompanyList: any[];
  companyListSubscription: Subscription;
  bookingEnabled: boolean;
  quitEnabled: boolean;
  bsRangeValue: Date[];

  constructor(private sessionApi: SessionApiService,
              private geoApi: GeoApiService,
              private companyApi: CompanyApiService,
              private datePipe: DatePipe,
              private tokenStorage: TokenStorageService,
              private auth: AuthService) { }


  ngOnDestroy(): void {
    this.companyListSubscription.unsubscribe();
    this.departementListSubscription.unsubscribe();
    this.regionListSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.hoursMin = this.hours;
    this.hoursMax = this.hours;
    this.bookingEnabled = true;
    this.quitEnabled = true;
    const dayDate = new Date();
    this.bsRangeValue = [new Date(), new Date(dayDate.setMonth(dayDate.getMonth() + 1))];
    this.selectedDate = this.bsRangeValue;

    // Region Subscription
    this.regionListSubscription = this.geoApi.regionListSubject.subscribe(
      data => {
        this.regionList = data;
      },
      err => {
        console.error(err);
      }
    );
    this.geoApi.emitRegionListSubject();

    // Departement Subscription
    this.departementListSubscription = this.geoApi.departementListSubject.subscribe(
      data => {
        this.departementList = data;
        this.queriedDepartementList = this.departementList;
      },
      err => {
        console.error(err);
      }
    );
    this.geoApi.emitDepartementListSubject();

    // Company List Subscription
    this.companyListSubscription = this.companyApi.companyListSubject.subscribe(
      data => {
        this.companyList = data;
        this.queriedCompanyList = this.companyList;
      },
      err => {
        console.error(err);
      }
    );
    this.companyApi.emitCompanyListSubject();
    this.onFilterChange('', '', '', '');
  }





  onRegionChange(codeRegion: string): void {
    this.selectedRegionCode = codeRegion;
    this.selectedDepartementCode = '';
    this.setQueryDepartementList(codeRegion);
    this.setQueryCompanyList(this.selectedRegionCode, this.selectedDepartementCode);
    this.onFilterChange(
      this.selectedRegionCode,
      this.selectedDepartementCode,
      this.selectedCompany,
      this.selectedLevel);
  }

  onDepartementChange(codeDepartement: string): void {
    this.selectedDepartementCode = codeDepartement;
    this.setQueryCompanyList(this.selectedRegionCode, this.selectedDepartementCode);
    this.onFilterChange(
      this.selectedRegionCode,
      this.selectedDepartementCode,
      this.selectedCompany,
      this.selectedLevel);
  }

  onCompanyChange(companyName: string): void {
    this.selectedCompany = companyName;
    this.onFilterChange(
      this.selectedRegionCode,
      this.selectedDepartementCode,
      this.selectedCompany,
      this.selectedLevel);
  }

  onDatechange(dateRange: any): void {
    this.selectedDate = [];
    for (const date of dateRange) {
      const extractedDate: Date = date;
      const dateString = this.datePipe.transform(extractedDate, 'yyyy-MM-dd');
      const dateToPush = new Date(dateString);
      this.selectedDate.push(dateToPush);
    }
    this.onFilterChange(
      this.selectedRegionCode,
      this.selectedDepartementCode,
      this.selectedCompany,
      this.selectedLevel);
  }

  onLevelChange(levelRequired: string): void {
    this.selectedLevel = levelRequired;
    this.onFilterChange(
      this.selectedRegionCode,
      this.selectedDepartementCode,
      this.selectedCompany,
      this.selectedLevel);
  }

  /**
   * QueriedDepartementList setter
   */
  setQueryDepartementList(codeRegion: string): void {
    if (codeRegion === '') {
      this.queriedDepartementList = this.departementList;
    } else {
      this.queriedDepartementList = this.departementList.filter(e => e.codeRegion === codeRegion);
    }
  }

  /**
   * QueriedCompanyList setter
   */
  setQueryCompanyList(codeRegion: string, codeDepartement: string): void {
    if ((codeRegion !== '' && codeDepartement !== '') || (codeRegion === '' && codeDepartement !== '')) {
      this.queriedCompanyList = this.companyList.filter(e => e.address.departement.code === codeDepartement);
    } else if (codeRegion !== '' && codeDepartement === '') {
      this.queriedCompanyList = this.companyList.filter(e => e.address.region.code === codeRegion);
    } else if (codeRegion === '' && codeDepartement === '') {
      this.queriedCompanyList = this.companyList;
    }
  }

  onFilterChange(
    regionCode: string,
    departementCode: string,
    companyName: string,
    badmintonRequiredLevel: string): void {
    this.sessionApi.getSessionsByHomeFilter(
      regionCode,
      departementCode,
      companyName,
      badmintonRequiredLevel
    ).subscribe(
      data => {
        this.sessions = data._embedded.sessions;
      },
      err => {
        console.error(err);
      }
    );
  }
}
