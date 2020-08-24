import { Departement } from './../../_models/departement';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region } from 'src/app/_models/region';

const GEO_API = 'https://geo.api.gouv.fr/';

@Injectable({
  providedIn: 'root'
})
export class GeoApiService {

  regionList: Region[];
  departementList: Departement[];
  regionListSubject = new Subject<any>();
  departementListSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  emitRegionListSubject(): void {
    this.regionListSubject.next(this.regionList);
  }

  emitDepartementListSubject(): void {
    this.departementListSubject.next(this.departementList);
  }

  getDepartementList(onSuccess: () => void): void{
    this.http.get(GEO_API + 'departements').subscribe(
      (data: Departement[]) => {
        this.departementList = data;
        this.emitDepartementListSubject();
        onSuccess();
      },
      err => {
        console.error(err);
      }
    );
  }

  getRegionList(onSuccess: () => void): void {
    this.http.get(GEO_API + 'regions').subscribe(
      (data: Region[]) => {
        this.regionList = data;
        this.emitRegionListSubject();
        onSuccess();
      },
      err => {
        console.error(err);
      }
    );
  }
}
