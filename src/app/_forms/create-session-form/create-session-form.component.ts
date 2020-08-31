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
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-create-session-form',
  templateUrl: './create-session-form.component.html',
  styleUrls: ['./create-session-form.component.scss']
})
export class CreateSessionFormComponent implements OnInit, OnDestroy {

  minDate = new Date();
  companyList: any[];
  companyListSubscription: Subscription;
  player: any;
  playerSubscription: Subscription;
  disabledDates = [new Date('2020-08-20')];
  selectedCompany: any;
  selectedDate: Date = new Date();
  generatedDaySchedule: Slot[] = [];
  departementList: Departement[];
  departementListSubscription: Subscription;
  selectedDepartement = '';
  regionList: Region[];
  regionListSubscription: Subscription;
  selectedRegion = '';
  queriedDepartementList: Departement[];
  queriedCompanyList: any[];
  sessionCreationSuccess: boolean;
  bookedSlots: string[] = [];
  levelSelect: any[] = [];

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
        this.queriedCompanyList = data;
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
        this.setLevelSelect(this.player.badmintonLevel);
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

    // Disable beginTime formcontrol
    this.createSessionForm.controls.beginTime.disable();
  }

  ngOnDestroy(): void {
    // Unsubscribe
    this.companyListSubscription.unsubscribe();
    this.departementListSubscription.unsubscribe();
    this.regionListSubscription.unsubscribe();
    this.playerSubscription.unsubscribe();
  }

  onSubmit(): void {
    // Get form value
    const session = this.createSessionForm.value;

    // // Get beginTime hour value
    // const beginTimeNumber = this.utils.formatHoursToNumber(session.beginTime);

    // Get date with format yyyy-MM-dd
    const dateFromForm: Date  = this.createSessionForm.value.date;
    const offset = dateFromForm.getTimezoneOffset();
    const dateWithOffset: Date = this.createSessionForm.value.date;
    dateWithOffset.setMinutes(dateFromForm.getMinutes() + offset * -1);
    console.log(dateWithOffset.toUTCString());
    // const date: string = this.datePipe.transform(this.createSessionForm.value.date, 'yyyy-MM-dd');

    // Overrride session date value
    session.date = dateWithOffset;

    // Set session beginTime
    session.beginTime = {display: session.beginTime.display, value: session.beginTime.value};

    // Set session endTime
    session.endTime = {display: this.utils.formatNumberToHour(session.beginTime.value + 1), value: session.beginTime.value + 1};

    // Set session participants
    const player = this.player;
    const maxPlayersNumber = this.createSessionForm.value.maxPlayersNumber;
    session.participants = [];
    for (let index = 0; index < maxPlayersNumber; index++) {
      if (index == 0) {
        session.participants.push(player);
      } else {
        session.participants.push({});
      }
    }

    // Set session default parameters
    session.readyParticipantsCount = 0;
    sessionStorage.isReserved = false;
    session.isLocked = false;
    session.isDone = false;
    session.isFull = false;
    session.isPlayed = false;

    // Create session by POST http request to session API
    this.sessionApi.createSession(session, () => {
      this.sessionCreationSuccess = true;
    },
      () => {
        this.sessionCreationSuccess = false;
      });

  }

  /**
   * SelectedCompany setter
   */
  setSelectedCompany(company): void {
    this.selectedCompany = company;
    this.createSessionForm.controls.beginTime.enable();
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
      const year: string = date.getFullYear().toString();
      const month: string = this.utils.formatNumberToStringWithTwoDigits(date.getMonth() + 1);
      const day: string = this.utils.formatNumberToStringWithTwoDigits(date.getDate());
      this.setBookedSlotsByCompanyEmailAndDate(company.email, year + '-' + month + '-' + day);
    }
  }

  /**
   * set session list by company email and date
   */
  setBookedSlotsByCompanyEmailAndDate(companyEmail: string, date: string): void {
    let sessions: any[];
    this.bookedSlots = [];
    this.sessionApi.getSessionsByCompanyEmailAndDate(companyEmail, date).subscribe(
      data => {
        sessions = data._embedded.sessions;
        for (const session of sessions) {
          this.bookedSlots.push(session.beginTime);
        }
        this.addBookedSlotsToGeneratedDaySchedule();
        console.log(this.generatedDaySchedule);
      },
      err => {
        console.error(err);
      }
    );
  }

  /**
   * Add booked slot to day schedule
   */
  addBookedSlotsToGeneratedDaySchedule(): void {
    for (const hourSlot of this.generatedDaySchedule) {
      if (this.bookedSlots.includes(hourSlot.display)) {
        hourSlot.isFree = false;
      }
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
    this.onChangeRegionOrDepartementSelect();
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
    this.onChangeRegionOrDepartementSelect();
    this.setQueryCompanyList(this.selectedRegion, this.selectedDepartement);
  }

  /**
   * Do changes on create session form on region and departement changes
   */
  onChangeRegionOrDepartementSelect(): void {
    this.createSessionForm.controls.company.setValue('');
    this.createSessionForm.controls.beginTime.setValue('');
    this.createSessionForm.controls.beginTime.disable();
  }


  setLevelSelect(playerLevel: string): void {
    this.levelSelect = [];
    const debutant = 'Débutant';
    const intermediaire = 'Intermédiaire';
    const confirme = 'Confirmé';
    if (playerLevel === debutant) {
      this.levelSelect.push(debutant);
    } else if (playerLevel === intermediaire) {
      this.levelSelect.push(debutant, intermediaire);
    } else {
      this.levelSelect.push(debutant, intermediaire, confirme);
    }
  }
}
