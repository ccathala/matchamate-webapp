import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

const SESSION_API = 'http://localhost:8084/matchamate-session-api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SessionApiService {

  constructor(private http: HttpClient) { }


  createSession(session, onSucces: () => void, onError: () => void): void {
    this.http.post(SESSION_API + 'sessions', session, httpOptions).subscribe(
      data => {
        onSucces();
      },
      err => {
        console.error(err);
        onError();
      }
    );
  }

  // getSessionByCompanyAndDate(company, date: Date, onSuccess: () => void) {
  //   const body = { company, date};
  //   this.http.get(SESSION_API + 'sessions/search/findByCompanyAndDate',
  //    {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   observe}).subscribe(
  //     data => {

  //     },
  //     err => {

  //     }
  //   );
  // }
}


