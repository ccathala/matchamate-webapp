import { SessionApiService } from './../../_services/_api/session-api.service';
import { PlayerApiService } from './../../_services/_api/player-api.service';
import { GeoApiService } from 'src/app/_services/_api/geo-api.service';
import { Departement } from './../../_models/departement';
import { Region } from './../../_models/region';
import { UtilsService } from './../../_services/utils.service';
import { Slot } from './../../_models/slot';
import { DatePipe } from '@angular/common';
import { CompanyApiService } from 'src/app/_services/_api/company-api.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-create-session-form',
  templateUrl: './create-session-form.component.html',
  styleUrls: ['./create-session-form.component.scss']
})
export class CreateSessionFormComponent implements OnInit, OnDestroy {

  bsValue = new Date();
  minDate = new Date();
  companyList: any[];
  companyListSubscription: Subscription;
  player: any;
  playerSubscription: Subscription;
  disabledDates = [new Date('2020-08-20')];
  selectedCompany: any;
  selectedDate: Date;
  generatedDaySchedule: Slot[] = [{ hour: '01:00', isFree: true }];
  departementList: Departement[];
  departementListSubscription: Subscription;
  selectedDepartement = '';
  regionList: Region[];
  regionListSubscription: Subscription;
  selectedRegion = '';
  queriedDepartementList: Departement[];
  queriedCompanyList: any[];
  sessionCreationSuccess: boolean;

  createSessionForm = new FormGroup({
    company: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    beginTime: new FormControl('', [Validators.required]),
    maxPlayersNumber: new FormControl('', [Validators.required]),
    badmintonRequiredLevel: new FormControl('', [Validators.required])
  });

  constructor(private companyApi: CompanyApiService,
              private utils: UtilsService,
              private geoApi: GeoApiService,
              private playerApi: PlayerApiService,
              private sessionApi: SessionApiService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {

    // Subscribe to companyList Subject
    this.companyListSubscription = this.companyApi.companyListSubject.subscribe(
      data => {
        this.companyList = data;
      },
      err => {
        console.error(err);
      }
    );

    // Subscribe to departementList Subject
    this.departementListSubscription = this.geoApi.departementListSubject.subscribe(
      data => {
        this.departementList = data;
      },
      err => {
        console.error(err);
      }
    );

    // Subscribe to regionList Subject
    this.regionListSubscription = this.geoApi.regionListSubject.subscribe(
      data => {
        this.regionList = data;
      },
      err => {
        console.error(err);
      }
    );

    // Subscribe to current Player Subject
    this.playerSubscription = this.playerApi.playerSubject.subscribe(
      data => {
        this.player = data;
      },
      err => {
        console.error(err);
      }
    );

    // initialize data from subjects
    this.companyApi.emitCompanyListSubject();
    this.geoApi.emitDepartementListSubject();
    this.geoApi.emitRegionListSubject();
    this.playerApi.emitPlayerSubject();

    // initialize create session form
    this.initCreateSessionForm();

    // initialize queried CompanyList
    this.queriedCompanyList = this.companyList;

  }

  ngOnDestroy(): void {
    this.companyListSubscription.unsubscribe();
    this.departementListSubscription.unsubscribe();
    this.regionListSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
  }

  onSubmit(): void {
    const session  = this.createSessionForm.value;
    const beginTimeNumber = this.utils.formatHoursToNumber(session.beginTime);
    const date: string = this.datePipe.transform(this.createSessionForm.value.date, 'yyyy-MM-dd');
    session.date = date;
    session.endTime = this.utils.formatNumberToHour(beginTimeNumber + 1);
    session.participants = [this.player];

    session.readyParticipantsCount = 0;
    sessionStorage.isReserved = false;
    session.isLocked = false;
    this.sessionApi.createSession(session, () => {
      this.sessionCreationSuccess = true;
    },
    () => {
     this.sessionCreationSuccess = false;
    });

  }


  /**
   * Init formcontrol from create session form
   */
  initCreateSessionForm(): void {
    this.createSessionForm.patchValue({
      date: this.bsValue
    });
  }

  /**
   * SelectedCompany setter
   */
  setSelectedCompany(company): void {
    this.selectedCompany = company;
    this.setDaySchedule(this.selectedCompany, this.selectedDate);
  }

  /**
   * SelectedDate setter
   */
  setSelectedDate(date: Date): void {
    this.selectedDate = date;
    this.setDaySchedule(this.selectedCompany, this.selectedDate);
  }

  /**
   * DaysSchedule setter
   */
  setDaySchedule(company: any, date: Date): void {
    if (company && date) {
      this.generatedDaySchedule = this.utils.generateCompanyDaySchedule(company.weekSchedule, date.getDay());
    }
  }


  /**
   * QueriedDepartementList setter
   */
  setQueryDepartementList(codeRegion: string): void {
    this.queriedDepartementList = this.departementList.filter(e => e.codeRegion === codeRegion);
  }

  /**
   * QueriedCompanyList setter
   */
  setQueryCompanyList(codeRegion: string, codeDepartement: string): void {
    if (codeRegion !== '' && codeDepartement !== '') {
      this.queriedCompanyList = this.companyList.filter(e => e.address.departement.code === codeDepartement);
    } else if (codeRegion !== '' && codeDepartement === '') {
      this.queriedCompanyList = this.companyList.filter(e => e.address.region.code === codeRegion);
    } else if (codeRegion === '' && codeDepartement === '') {
      this.queriedCompanyList = this.companyList;
    }
  }

  /**
   * SelectedDepartement setter
   */
  setSelectedDepartement(codeDepartement: string): void {
    this.selectedDepartement = codeDepartement;
  }

  /**
   * SelectedRegion setter
   */
  setSelectedRegion(codeRegion: string): void {
    this.selectedRegion = codeRegion;
  }

  /**
   * On change of departement selection:
   * - set selected departement
   * - set queried company list
   */
  onChangeDepartementSelect(codeDepartement: string): void {
    this.setSelectedDepartement(codeDepartement);
    this.setQueryCompanyList(this.selectedRegion, this.selectedDepartement);
  }

  /**
   * On change of region selection:
   * - set selected region
   * - set selected departement empty
   * - set queried departement list
   * - set queried company list
   */
  onChangeRegionSelect(codeRegion: string): void {
    this.setSelectedRegion(codeRegion);
    this.setSelectedDepartement('');
    this.setQueryDepartementList(codeRegion);
    this.setQueryCompanyList(this.selectedRegion, this.selectedDepartement);
  }

}
