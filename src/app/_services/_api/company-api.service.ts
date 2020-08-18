import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const COMPANY_API = 'http://localhost:8084/matchamate-company-api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService {

  company: any = {};
  companySubject = new Subject<any>();

  constructor(private http: HttpClient) {
    console.log('init company api');
  }

  emitCompanySubject(): void {
    this.companySubject.next(this.company);
  }

  registerCompany(company): Observable<any> {
      company.avatarPicture = '/pictures/default.png';
      return this.http.post(COMPANY_API + 'companies',
      company,
      httpOptions);
  }

  getCompanyByEmail(email: string, onSuccess: () => void): void {
    this.http.get(COMPANY_API
      + 'companies/search/findByEmail?email='
      + email).subscribe(
        data => {
          this.company = data;
          this.emitCompanySubject();
          onSuccess();
        },
        err => {
          console.error(err);
        }
      );
  }

  fullyUpdateCompany(company: any, id: string): Observable<any> {
    return this.http.put(COMPANY_API
      + 'companies/' + id,
      company,
      httpOptions);
  }

  deleteCompanyByEmail(email): Observable<any> {
    return this.http.get(
      COMPANY_API
      + 'companies/search/deleteByEmail?email='
      + email);
  }
}
