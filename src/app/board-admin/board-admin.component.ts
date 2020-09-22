import { element } from 'protractor';
import { SessionApiService } from './../_services/_api/session-api.service';
import { Subscription } from 'rxjs';
import { AuthService } from './../_services/auth.service';
import { CompanyApiService } from './../_services/_api/company-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit, OnDestroy {

  isSuccessful = false;
  isSignUpFailed = false;
  isSuccessfullyRegisteredCompany = false;
  errorMessageAuthRegistration = '';
  errorMessageCompanyRegistration = '';
  errorMessage = '';
  companyList: any[];
  companyListSubscription: Subscription;
  selectedCompany: any;
  selectedCompanySessions: any[];
  companyDeleteIsSuccessful: boolean;
  companyDeleteFailed: boolean;

  registerCompanyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required])
  });

  content: string;

  constructor(private userService: UserService,
    private companyApi: CompanyApiService,
    private authService: AuthService,
    private sessionApi: SessionApiService) { }


  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );

    this.companyListSubscription = this.companyApi.companyListSubject.subscribe(
      data => {
        this.companyList = data;
      },
      err => {
        console.error(err);
      }
    );
    this.companyApi.emitCompanyListSubject();
  }

  ngOnDestroy(): void {
    this.companyListSubscription.unsubscribe();
  }

  onSubmit(): void {
    const form = this.registerCompanyForm.value;
    // Init company attributes
    form.address = {
      buildingNumber: '',
      street: '',
      city: '',
      zipCode: '',
      departement: {},
      region: {},
      weekSchedule: []
    };

    form.weekSchedule = [{
      dayName: 'monday',
      dayIndex: 1,
      openingTime: '00:00',
      closingTime: '23:00'
    },
    {
      dayName: 'tuesday',
      dayIndex: 2,
      openingTime: '00:00',
      closingTime: '23:00'
    },
    {
      dayName: 'wednesday',
      dayIndex: 3,
      openingTime: '00:00',
      closingTime: '23:00'
    },
    {
      dayName: 'thursday',
      dayIndex: 4,
      openingTime: '00:00',
      closingTime: '23:00'
    },
    {
      dayName: 'friday',
      dayIndex: 5,
      openingTime: '00:00',
      closingTime: '23:00'
    },
    {
      dayName: 'saturday',
      dayIndex: 6,
      openingTime: '00:00',
      closingTime: '23:00'
    },
    {
      dayName: 'sunday',
      dayIndex: 0,
      openingTime: '00:00',
      closingTime: '23:00'
    }];

    form.companyDataIsSet = false;

    // Register Company in Company-api
    this.companyApi.registerCompany(form).subscribe(
      dataPlayerRegistration => {
        // Company registration is successful
        console.log(dataPlayerRegistration);
        this.isSuccessfullyRegisteredCompany = true;
        // Register user in auth server
        this.authService.register(form, ['company']).subscribe(
          dataAuthRegistration => {
            // User registration is successful
            console.log(dataAuthRegistration);
            this.isSuccessful = true;
          },
          errAuthRegistration => {
            // User registration failure
            this.errorMessageAuthRegistration = errAuthRegistration.error.message;
            this.isSignUpFailed = true;
            this.companyApi.deleteCompanyByEmail(this.registerCompanyForm.value.email).subscribe(
              data => {
                console.log(data);
              },
              err => {
                this.errorMessage = err.error.message;
              }
            );
          }
        );
      },
      errCompanyRegistration => {
        // User registration failure
        console.error(errCompanyRegistration);
        this.errorMessageCompanyRegistration = errCompanyRegistration.error.message;
        this.isSignUpFailed = true;
      }
    );
    this.companyApi.getCompanies(() => {});
  }

  get email(): any {
    return this.registerCompanyForm.get('email');
  }

  get password(): any {
    return this.registerCompanyForm.get('password');
  }

  get passwordConfirm(): any {
    return this.registerCompanyForm.get('passwordConfirm');
  }

  get name(): any {
    return this.registerCompanyForm.get('name');
  }

  setSelectedCompany(companyName: string): void {
    this.selectedCompany = this.getCompanyByNameFromCompanyList(companyName);
    this.getSessionByCompanyEmail(this.selectedCompany.email);
  }

  deleteSelectedCompany(): void {
    if (confirm('Confirmer la suppression de la compagnie ' + this.selectedCompany.name)) {
          this.deleteEachSessionFromSessionList(this.selectedCompanySessions, () => {
            this.deleteCompanyFromAllServices(this.selectedCompany, () => {
              this.companyDeleteIsSuccessful = true;
              this.companyDeleteFailed = false;
              this.companyApi.getCompanies(() => {});
            });
          });

    }
  }

  getCompanyByNameFromCompanyList(companyName: string): any {
    let companyToReturn = null;
    for (const company of this.companyList) {
      if (company.name === companyName) {
        companyToReturn = company;
      }
    }
    return companyToReturn;
  }

  deleteEachSessionFromSessionList(sessions: any[], onSuccess: () => void): void {
    for (const session of sessions) {
      const id = this.sessionApi.getIdFromSessionRequest(session._links.self.href);
      this.sessionApi.deleteSessionById(id).subscribe(
        data => {
          console.log(data);
        },
        err => {
          console.error(err);
          this.companyDeleteIsSuccessful = false;
          this.companyDeleteFailed = true;
        }
      );
    }
    onSuccess();
  }

  deleteCompanyFromAllServices(company: any, onSuccess: () => void): void {
    this.companyApi.deleteCompanyByEmail(company.email).subscribe(
      dataCompany => {
        this.authService.deleteUser(company.email).subscribe(
          dataAuth => {
            console.log(dataAuth);
            onSuccess();
          },
          errAuth => {
            this.companyApi.registerCompany(company).subscribe(
              data => {
                console.log(data);
              },
              err => {
                this.companyDeleteIsSuccessful = false;
                this.companyDeleteFailed = true;
                console.error(err);
              }
            );
          }
        );
      },
      errCompany => {
        this.companyDeleteIsSuccessful = false;
        this.companyDeleteFailed = true;
        console.error(errCompany);
      }
    );
  }

  getSessionByCompanyEmail(companyEmail: string): void {
    this.selectedCompanySessions = [];
    this.sessionApi.getSessionsByCompanyEmail(companyEmail).subscribe(
      data => {
        this.selectedCompanySessions = data._embedded.sessions;
      },
      err => {
        console.error(err);
      }
    );
  }
}
