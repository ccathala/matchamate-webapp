import { UtilsService } from './utils.service';
import { PlayerApiService } from './_api/player-api.service';
import { CompanyApiService } from './_api/company-api.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:8084/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private companyApi: CompanyApiService,
    private playerApi: PlayerApiService,
    private utils: UtilsService) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email: credentials.email,
      password: credentials.password,
    }, httpOptions);
  }

  register(user, roles): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      email: user.email,
      password: user.password,
      passwordConfirm: user.passwordConfirm,
      roles
    }, httpOptions);
  }

  deleteUser(userEmail: string): Observable<any> {
    return this.http.delete(AUTH_API + 'deleteuser?email=' + userEmail);
  }

  refreshToken(tokenString: string): Observable<any> {
    console.log('Refresh token');
    return this.http.post(AUTH_API + 'refreshtoken', tokenString, httpOptions);
  }

  validateToken(tokenString: string): Observable<any> {
    return this.http.post(AUTH_API + 'validatetoken', tokenString, httpOptions);
  }
}
