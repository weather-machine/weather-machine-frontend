import { Injectable } from '@angular/core';
import {Observable, Observer} from 'rxjs';
import { } from '@types/googlemaps';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  geocoder: google.maps.Geocoder;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  geocodeAddress(address: string): Observable<object> {
    return Observable.create((observer: Observer<object>) => {
      this.geocoder.geocode({'address': address}, function (results, status) {
        // @ts-ignore
        if (status === 'OK') {
          observer.next({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          observer.error('Geocode was not successful for the following reason: ' + status);
        }
        observer.complete();
      });
    });
  }
}
