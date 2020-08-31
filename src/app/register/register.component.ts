import { ErrorHandlerService } from './../_services/error-handler.service';
import { PlayerApiService } from '../_services/_api/player-api.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isSuccessful = false;
  isSignUpFailed = false;
  isSuccessfullyRegisteredPlayer = false;
  errorMessageAuthRegistration = '';
  errorMessagePlayerRegistration = '';
  errorMessage = '';

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    badmintonLevel: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private playerApi: PlayerApiService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Register player in player-api
    this.playerApi.registerPlayer(this.registerForm.value).subscribe(
      dataPlayerRegistration => {
        // Player registration is successful
        console.log(dataPlayerRegistration);
        this.isSuccessfullyRegisteredPlayer = true;
        // Register user in auth server
        this.authService.register(this.registerForm.value, null).subscribe(
          dataAuthRegistration => {
            // User registration is successful
            console.log(dataAuthRegistration);
            this.isSuccessful = true;
          },
          errAuthRegistration => {
            // User registration failure
            console.error(errAuthRegistration);
            this.errorMessageAuthRegistration = errAuthRegistration.error.message;
            this.isSignUpFailed = true;
            this.playerApi.deletePlayerByEmail(this.registerForm.value.email).subscribe(
              data => {
                console.log(data);
              },
              err => {
                console.error(err);
                this.errorMessage = err.error.message;
              }
            );
          }
        );
      },
      errPlayerRegistration => {
        // User registration failure
        this.errorMessagePlayerRegistration = errPlayerRegistration.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  get email(): any {
    return this.registerForm.get('email');
  }

  get password(): any {
    return this.registerForm.get('password');
  }

  get passwordConfirm(): any {
    return this.registerForm.get('passwordConfirm');
  }

  get firstName(): any {
    return this.registerForm.get('firstName');
  }

  get lastName(): any {
    return this.registerForm.get('lastName');
  }

  get gender(): any {
    return this.registerForm.get('gender');
  }

  get badmintonLevel(): any {
    return this.registerForm.get('badmintonLevel');
  }

}
