import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private REST_API_URL: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  public pullingIntervalDelay = 10000;

  constructor(private http: HttpClient) {
    this.REST_API_URL = environment.REST_API_URL;
  }

  getForecastForPlace(place: any) {
    return this.http.post(this.REST_API_URL + 'forecastForPlace', place, this.httpOptions);
  }
}
