import { Subscription } from 'rxjs';
import { UtilsService } from './../../_services/utils.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Departement } from 'src/app/_models/departement';
import { Region } from 'src/app/_models/region';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyApiService } from 'src/app/_services/_api/company-api.service';
import { GeoApiService } from 'src/app/_services/_api/geo-api.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

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
  '23:00'];

@Component({
  selector: 'app-data-company-form',
  templateUrl: './data-company-form.component.html',
  styleUrls: ['./data-company-form.component.scss']
})
export class DataCompanyFormComponent implements OnInit, OnDestroy {

  companyId: string;
  // @Input()
  company: any = {};
  companySubscription: Subscription;
  departementList: Departement[] = [];
  regionList: Region[] = [];
  @Input()
  hoursList: string[] = hours;
  @Input()
  isCompanyDataModificationInProgress: boolean;
  @Output()
  isCompanyDataModificationInProgressEvent = new EventEmitter<boolean>();


  companyDatamodificationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    avatarPicture: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    web: new FormControl(''),
    address: new FormGroup({
      buildingNumber: new FormControl(''),
      street: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl(''),
      departement: new FormControl(''),
      region: new FormControl('')
    }),
    companyOpeningHours: new FormGroup({
      monday: new FormGroup({
        dayName: new FormControl(''),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      tuesday: new FormGroup({
        dayName: new FormControl(''),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      wednesday: new FormGroup({
        dayName: new FormControl(''),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      thursday: new FormGroup({
        dayName: new FormControl(''),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      friday: new FormGroup({
        dayName: new FormControl(''),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      saturday: new FormGroup({
        dayName: new FormControl(''),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      }),
      sunday: new FormGroup({
        dayName: new FormControl(''),
        openingTime: new FormControl(''),
        closingTime: new FormControl('')
      })
    })
  });

  constructor(private companyApi: CompanyApiService,
              private geoApi: GeoApiService,
              private tokenStorage: TokenStorageService,
              private utils: UtilsService) { }


  ngOnInit(): void {
    this.setGeoData();
    this.companyId = this.utils.getUserIdKey();
    this.companySubscription = this.companyApi.companySubject.subscribe(
      data => {
        this.company = data;
      },
      err => {
        console.error(err);
      }
    );
    this.companyApi.emitCompanySubject();
    this.initDataModificationForm();
  }

  ngOnDestroy(): void {
    this.companySubscription.unsubscribe();
  }

  onSubmit(): void {
    console.log(this.companyDatamodificationForm.value);
    this.companyApi.fullyUpdateCompany(this.companyDatamodificationForm.value, this.companyId).subscribe(
      data => {
        console.log(data);
        this.companyApi.getCompanyByEmail(data.email, () => {
          this.disableCompanyDataModificationInProgress();
        });
      },
      err => {
        console.error(err);
      }
    );
  }

  initDataModificationForm(): void {
    this.initCompanyDataMainProperties();
    this.initCompanyDataAddressFormControl();
    this.initCompanyDataOpeningHoursFormControl();
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
            departement: this.company.address.departement
          }
        });
      }

      // Init region formControl-------------------------------
      if (!!this.company.address.region) {
        this.companyDatamodificationForm.patchValue({
          address: {
            region: this.company.address.region
          }
        });
      }
    }
  }

  initCompanyDataOpeningHoursFormControl(): void {
    if (!!this.company.companyOpeningHours) {

      if (!!this.company.companyOpeningHours.monday) {
        this.companyDatamodificationForm.patchValue({
          companyOpeningHours: {
            monday: {
              dayName: 'lundi',
              openingTime: this.company.companyOpeningHours.monday.openingTime,
              closingTime: this.company.companyOpeningHours.monday.closingTime
            }
          }
        });
      }

      if (!!this.company.companyOpeningHours.tuesday) {
        this.companyDatamodificationForm.patchValue({
          companyOpeningHours: {
            tuesday: {
              dayName: 'mardi',
              openingTime: this.company.companyOpeningHours.tuesday.openingTime,
              closingTime: this.company.companyOpeningHours.tuesday.closingTime
            }
          }
        });
      }

      if (!!this.company.companyOpeningHours.wednesday) {
        this.companyDatamodificationForm.patchValue({
          companyOpeningHours: {
            wednesday: {
              dayName: 'mercredi',
              openingTime: this.company.companyOpeningHours.wednesday.openingTime,
              closingTime: this.company.companyOpeningHours.wednesday.closingTime
            }
          }
        });
      }

      if (!!this.company.companyOpeningHours.thursday) {
        this.companyDatamodificationForm.patchValue({
          companyOpeningHours: {
            thursday: {
              dayName: 'jeudi',
              openingTime: this.company.companyOpeningHours.thursday.openingTime,
              closingTime: this.company.companyOpeningHours.thursday.closingTime
            }
          }
        });
      }

      if (!!this.company.companyOpeningHours.friday) {
        this.companyDatamodificationForm.patchValue({
          companyOpeningHours: {
            friday: {
              dayName: 'vendredi',
              openingTime: this.company.companyOpeningHours.friday.openingTime,
              closingTime: this.company.companyOpeningHours.friday.closingTime
            }
          }
        });
      }

      if (!!this.company.companyOpeningHours.saturday) {
        this.companyDatamodificationForm.patchValue({
          companyOpeningHours: {
            saturday: {
              dayName: 'samedi',
              openingTime: this.company.companyOpeningHours.saturday.openingTime,
              closingTime: this.company.companyOpeningHours.saturday.closingTime
            }
          }
        });
      }

      if (!!this.company.companyOpeningHours.sunday) {
        this.companyDatamodificationForm.patchValue({
          companyOpeningHours: {
            sunday: {
              dayName: 'dimanche',
              openingTime: this.company.companyOpeningHours.sunday.openingTime,
              closingTime: this.company.companyOpeningHours.sunday.closingTime
            }
          }
        });
      }
    }
  }
  setDepartementList(): void {
    this.geoApi.getDepartementList().subscribe(
      (data: Departement[]) => {
        this.departementList = data;

      },
      err => {
        console.error(err);
      }
    );
  }

  setRegionList(): void {
    this.geoApi.getRegionList().subscribe(
      (data: Region[]) => {
        this.regionList = data;
      },
      err => {
        console.error(err);
      }
    );
  }

  setGeoData(): void {
    this.setDepartementList();
    this.setRegionList();
  }

  disableCompanyDataModificationInProgress(): void {
    this.isCompanyDataModificationInProgressEvent.emit(false);
  }

  get address(): any {
    return this.companyDatamodificationForm.get('address');
  }

}
