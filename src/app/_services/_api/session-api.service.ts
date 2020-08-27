import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

const SESSION_API = 'http://localhost:8084/matchamate-session-api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const httpPatchOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json-patch+json' })
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

  getSessionsByCompanyEmailAndDate(companyEmail: string, date: string): Observable<any> {
    return this.http.get(SESSION_API + 'sessions/search/findByCompany_EmailAndDate?email=' + companyEmail + '&date=' + date);
  }

  getSessionsByPlayerEmail(playerEmail: string): Observable<any> {
    return this.http.get(SESSION_API + 'sessions/search/findByParticipants_Email?email=' + playerEmail);
  }

  getSessionById(id: string): Observable<any> {
    return this.http.get(SESSION_API + 'sessions/' + id);
  }

  deleteSessionById(id: string): Observable<any> {
    return this.http.delete(SESSION_API + 'sessions/' + id);
  }

  replaceSessionValue(id: string, path: string, value: any): Observable<any> {
    return this.http.patch(SESSION_API + 'sessions/' + id,
    [{
      op: 'replace',
      path,
      value
    }],
    httpPatchOptions);
  }

  getIdFromSessionRequest(href: string): string {
    return href.substring(31);
  }
}


