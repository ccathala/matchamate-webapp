import { AuthService } from './../_services/auth.service';
import { CompanyApiService } from './../_services/_api/company-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {

  isSuccessful = false;
  isSignUpFailed = false;
  isSuccessfullyRegisteredCompany = false;
  errorMessageAuthRegistration = '';
  errorMessageCompanyRegistration = '';
  errorMessage = '';

  registerCompanyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required])
  });

  content: string;

  constructor(private userService: UserService, private companyApi: CompanyApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  onSubmit(): void {
    const form = this.registerCompanyForm.value;
    // Init company attributes
    form.address = {
      buildingNumber: '',
      street: '',
      city: '',
      zipCode: '',
      departement: '',
      region: ''
    };

    form.companyOpeningHours = {
      monday: {
        dayName: 'lundi',
        openingTime: '',
        closingTime: ''
      },
      tuesday: {
        dayName: 'mardi',
        openingTime: '',
        closingTime: ''
      },
      wednesday: {
        dayName: 'mercredi',
        openingTime: '',
        closingTime: ''
      },
      thursday: {
        dayName: 'jeudi',
        openingTime: '',
        closingTime: ''
      },
      friday: {
        dayName: 'vendredi',
        openingTime: '',
        closingTime: ''
      },
      saturday: {
        dayName: 'samedi',
        openingTime: '',
        closingTime: ''
      },
      sunday: {
        dayName: 'dimanche',
        openingTime: '',
        closingTime: ''
      },
    };

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
  }

  get email(): any{
    return this.registerCompanyForm.get('email');
  }

  get password(): any{
    return this.registerCompanyForm.get('password');
  }

  get passwordConfirm(): any{
    return this.registerCompanyForm.get('passwordConfirm');
  }

  get name(): any{
    return this.registerCompanyForm.get('name');
  }

}
