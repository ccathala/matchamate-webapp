import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const GEO_API = 'https://geo.api.gouv.fr/';

@Injectable({
  providedIn: 'root'
})
export class GeoApiService {

  constructor(private http: HttpClient) { }

  getDepartementList(): Observable<any> {
    return this.http.get(GEO_API + 'departements?fields=[name]');
  }

  getRegionList(): Observable<any> {
    return this.http.get(GEO_API + 'regions');
  }
}
