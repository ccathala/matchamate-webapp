import { Subscription } from 'rxjs';
import { UtilsService } from './../../_services/utils.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Departement } from 'src/app/_models/departement';
import { Region } from 'src/app/_models/region';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CompanyApiService } from 'src/app/_services/_api/company-api.service';
import { GeoApiService } from 'src/app/_services/_api/geo-api.service';

const hours = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
];

@Component({
  selector: 'app-data-company-form',
  templateUrl: './data-company-form.component.html',
  styleUrls: ['./data-company-form.component.scss']
})
export class DataCompanyFormComponent implements OnInit, OnDestroy {

  companyId: string;
  company: any = {};
  companySubscription: Subscription;
  departementList: Departement[] = [];
  departementListSubscription: Subscription;
  selectedDepartement: Departement;
  regionList: Region[] = [];
  regionListSubscription: Subscription;
  selectedRegion: Region;
  mondayOpeningHours: any[] = hours;
  mondayClosingHours: any[] = hours;
  tuesdayOpeningHours: any[] = hours;
  tuesdayClosingHours: any[] = hours;
  wednesdayOpeningHours: any[] = hours;
  wednesdayClosingHours: any[] = hours;
  thursdayOpeningHours: any[] = hours;
  thursdayClosingHours: any[] = hours;
  fridayOpeningHours: any[] = hours;
  fridayClosingHours: any[] = hours;
  saturdayOpeningHours: any[] = hours;
  saturdayClosingHours: any[] = hours;
  sundayOpeningHours: any[] = hours;
  sundayClosingHours: any[] = hours;
  @Input()
  isCompanyDataModificationInProgress: boolean;
  @Output()
  isCompanyDataModificationInProgressEvent = new EventEmitter<boolean>();
  weekSchedule: any[] = [];

  companyDatamodificationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    avatarPicture: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    web: new FormControl(''),
    address: new FormGroup({
      buildingNumber: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      departement: new FormControl('', [Validators.required]),
    }),
    weekSchedule: new FormGroup({
      monday: new FormGroup({
        dayName: new FormControl('monday'),
        dayIndex: new FormControl(1),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      tuesday: new FormGroup({
        dayName: new FormControl('tuesday'),
        dayIndex: new FormControl(2),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      wednesday: new FormGroup({
        dayName: new FormControl('wednesday'),
        dayIndex: new FormControl(3),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      thursday: new FormGroup({
        dayName: new FormControl('thursday'),
        dayIndex: new FormControl(4),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      friday: new FormGroup({
        dayName: new FormControl('friday'),
        dayIndex: new FormControl(5),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      saturday: new FormGroup({
        dayName: new FormControl('saturday'),
        dayIndex: new FormControl(6),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      sunday: new FormGroup({
        dayName: new FormControl('sunday'),
        dayIndex: new FormControl(0),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
    })
  });

  constructor(private companyApi: CompanyApiService,
    private geoApi: GeoApiService,
    private utils: UtilsService) { }


  ngOnInit(): void {
    this.companyId = this.utils.getUserIdKey();

    this.companySubscription = this.companyApi.companySubject.subscribe(
      data => {
        this.company = data;
      },
      err => {
        console.error(err);
      }
    );

    this.departementListSubscription = this.geoApi.departementListSubject.subscribe(
      data => {
        this.departementList = data;
      },
      err => {
        console.error(err);
      }
    );

    this.regionListSubscription = this.geoApi.regionListSubject.subscribe(
      data => {
        this.regionList = data;
      },
      err => {
        console.error(err);
      }
    );
    this.companyApi.emitCompanySubject();
    this.geoApi.emitDepartementListSubject();
    this.geoApi.emitRegionListSubject();
    this.initDataModificationForm();
  }

  ngOnDestroy(): void {
    this.companySubscription.unsubscribe();
    this.departementListSubscription.unsubscribe();
    this.regionListSubscription.unsubscribe();
  }

  onSubmit(): void {
    // Declare attributes
    console.log(this.companyDatamodificationForm.value);
    const companyData = this.companyDatamodificationForm.value;
    const selectedDepartementCode = companyData.address.departement;
    console.log(companyData);

    // // Set weekSchedule array
    this.weekSchedule.push(companyData.weekSchedule.monday);
    this.weekSchedule.push(companyData.weekSchedule.tuesday);
    this.weekSchedule.push(companyData.weekSchedule.wednesday);
    this.weekSchedule.push(companyData.weekSchedule.thursday);
    this.weekSchedule.push(companyData.weekSchedule.friday);
    this.weekSchedule.push(companyData.weekSchedule.saturday);
    this.weekSchedule.push(companyData.weekSchedule.sunday);

    // Override companyData.weekSchedule with weekSchedule array
    companyData.weekSchedule = this.weekSchedule;

    // Override companyData.departement
    companyData.address.departement = this.getDepartementByCode(selectedDepartementCode);

    // Override companyData.region
    companyData.address.region = this.getRegionByCode(companyData.address.departement.codeRegion);

    companyData.companyDataIsSet = true;

    // Update company on api
    this.companyApi.fullyUpdateCompany(companyData, this.companyId).subscribe(
      data => {
        this.companyApi.getCompanyByEmail(data.email, () => {
          this.disableCompanyDataModificationInProgress();
        });
        this.companyApi.getCompanies(() => {});
      },
      err => {
        console.error(err);
      }
    );
    this.weekSchedule = [];
  }

  getDepartementByCode(code: string): Departement {
    return this.departementList.find(e => e.code === code);
  }

  getRegionByCode(code: string): Region {
    return this.regionList.find(e => e.code === code);
  }

  initDataModificationForm(): void {
    this.initCompanyDataMainProperties();
    this.initCompanyDataAddressFormControl();
    this.initCompanyWeekScheduleFormControl();
  }

  initCompanyDataMainProperties(): void {
    this.companyDatamodificationForm.patchValue({
      name: this.company.name,
      email: this.company.email,
      avatarPicture: this.company.avatarPicture
    });

    if (!!this.company.phone) {
      this.companyDatamodificationForm.patchValue({
        phone: this.company.phone
      });
    }

    if (!!this.company.web) {
      this.companyDatamodificationForm.patchValue({
        web: this.company.web
      });
    }

  }

  initCompanyDataAddressFormControl(): void {
    if (!!this.company.address) {
      // Init buildingNumber formControl-------------------------------
      if (!!this.company.address.buildingNumber) {
        this.companyDatamodificationForm.patchValue({
          address: {
            buildingNumber: this.company.address.buildingNumber
          }
        });
      }

      // Init street formControl-------------------------------
      if (!!this.company.address.street) {
        this.companyDatamodificationForm.patchValue({
          address: {
            street: this.company.address.street
          }
        });
      }

      // Init city formControl-------------------------------
      if (!!this.company.address.city) {
        this.companyDatamodificationForm.patchValue({
          address: {
            city: this.company.address.city
          }
        });
      }

      // Init zipCode formControl-------------------------------
      if (!!this.company.address.zipCode) {
        this.companyDatamodificationForm.patchValue({
          address: {
            zipCode: this.company.address.zipCode
          }
        });
      }

      // Init departement formControl-------------------------------
      if (!!this.company.address.departement) {
        this.companyDatamodificationForm.patchValue({
          address: {
            departement: this.company.address.departement.code
          }
        });
      }
    }
  }

  initCompanyWeekScheduleFormControl(): void {
    if (!!this.company.weekSchedule) {

      if (!!this.company.weekSchedule[0]) {
        this.companyDatamodificationForm.patchValue({
          weekSchedule: {
            monday: {
              openingTime: this.company.weekSchedule[0].openingTime,
              closingTime: this.company.weekSchedule[0].closingTime
            }
          }
        });
        this.onMondayOpeningHourChange(this.company.weekSchedule[0].openingTime);
        this.onMondayClosingHourChange(this.company.weekSchedule[0].closingTime);
      }

      if (!!this.company.weekSchedule[1]) {
        this.companyDatamodificationForm.patchValue({
          weekSchedule: {
            tuesday: {
              openingTime: this.company.weekSchedule[1].openingTime,
              closingTime: this.company.weekSchedule[1].closingTime
            }
          }
        });
        this.onTuesdayOpeningHourChange(this.company.weekSchedule[1].openingTime);
        this.onTuesdayClosingHourChange(this.company.weekSchedule[1].closingTime);
      }

      if (!!this.company.weekSchedule[2]) {
        this.companyDatamodificationForm.patchValue({
          weekSchedule: {
            wednesday: {
              openingTime: this.company.weekSchedule[2].openingTime,
              closingTime: this.company.weekSchedule[2].closingTime
            }
          }
        });
        this.onWednesdayOpeningHourChange(this.company.weekSchedule[2].openingTime);
        this.onWednesdayClosingHourChange(this.company.weekSchedule[2].closingTime);
      }

      if (!!this.company.weekSchedule[3]) {
        this.companyDatamodificationForm.patchValue({
          weekSchedule: {
            thursday: {
              openingTime: this.company.weekSchedule[3].openingTime,
              closingTime: this.company.weekSchedule[3].closingTime
            }
          }
        });
        this.onThursdayOpeningHourChange(this.company.weekSchedule[3].openingTime);
        this.onThursdayClosingHourChange(this.company.weekSchedule[3].closingTime);
      }

      if (!!this.company.weekSchedule[4]) {
        this.companyDatamodificationForm.patchValue({
          weekSchedule: {
            friday: {
              openingTime: this.company.weekSchedule[4].openingTime,
              closingTime: this.company.weekSchedule[4].closingTime
            }
          }
        });
        this.onFridayOpeningHourChange(this.company.weekSchedule[4].openingTime);
        this.onFridayClosingHourChange(this.company.weekSchedule[4].closingTime);
      }

      if (!!this.company.weekSchedule[5]) {
        this.companyDatamodificationForm.patchValue({
          weekSchedule: {
            saturday: {
              openingTime: this.company.weekSchedule[5].openingTime,
              closingTime: this.company.weekSchedule[5].closingTime
            }
          }
        });
        this.onSaturdayOpeningHourChange(this.company.weekSchedule[5].openingTime);
        this.onSaturdayClosingHourChange(this.company.weekSchedule[5].closingTime);
      }

      if (!!this.company.weekSchedule[6]) {
        this.companyDatamodificationForm.patchValue({
          weekSchedule: {
            sunday: {
              openingTime: this.company.weekSchedule[6].openingTime,
              closingTime: this.company.weekSchedule[6].closingTime
            }
          }
        });
        this.onSundayOpeningHourChange(this.company.weekSchedule[6].openingTime);
        this.onSundayClosingHourChange(this.company.weekSchedule[6].closingTime);
      }
    }
  }

  disableCompanyDataModificationInProgress(): void {
    this.isCompanyDataModificationInProgressEvent.emit(false);
  }

  onMondayOpeningHourChange(hour: string): void{
    this.mondayClosingHours = this.onHourMinChange(hour);
  }

  onMondayClosingHourChange(hour: string): void{
    this.mondayOpeningHours = this.onHourMaxChange(hour);
  }

  onTuesdayOpeningHourChange(hour: string): void{
    this.tuesdayClosingHours = this.onHourMinChange(hour);
  }

  onTuesdayClosingHourChange(hour: string): void{
    this.tuesdayOpeningHours = this.onHourMaxChange(hour);
  }

  onWednesdayOpeningHourChange(hour: string): void{
    this.wednesdayClosingHours = this.onHourMinChange(hour);
  }

  onWednesdayClosingHourChange(hour: string): void{
    this.wednesdayOpeningHours = this.onHourMaxChange(hour);
  }

  onThursdayOpeningHourChange(hour: string): void{
    this.thursdayClosingHours = this.onHourMinChange(hour);
  }

  onThursdayClosingHourChange(hour: string): void{
    this.thursdayOpeningHours = this.onHourMaxChange(hour);
  }

  onFridayOpeningHourChange(hour: string): void{
    this.fridayClosingHours = this.onHourMinChange(hour);
  }

  onFridayClosingHourChange(hour: string): void{
    this.fridayOpeningHours = this.onHourMaxChange(hour);
  }

  onSaturdayOpeningHourChange(hour: string): void{
    this.saturdayClosingHours = this.onHourMinChange(hour);
  }

  onSaturdayClosingHourChange(hour: string): void{
    this.saturdayOpeningHours = this.onHourMaxChange(hour);
  }

  onSundayOpeningHourChange(hour: string): void{
    this.sundayClosingHours = this.onHourMinChange(hour);
  }

  onSundayClosingHourChange(hour: string): void{
    this.sundayOpeningHours = this.onHourMaxChange(hour);
  }

  onHourMinChange(hourMin: string): string[] {
    const hourMinNumber = this.utils.formatHoursToNumber(hourMin);
    const closingHours = [];
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < hours.length; index++) {
      const element = this.utils.formatHoursToNumber(hours[index]);
      if (element > hourMinNumber) {
        closingHours.push(hours[index]);
      }
    }
    return closingHours;
  }

  onHourMaxChange(hourMax: string): string[] {
    const hourMaxNumber = this.utils.formatHoursToNumber(hourMax);
    const openingHours = [];
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < hours.length; index++) {
      const element = this.utils.formatHoursToNumber(hours[index]);
      if (element < hourMaxNumber) {
        openingHours.push(hours[index]);
      }
    }
    return openingHours;
  }
}
