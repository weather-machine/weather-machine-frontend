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
        if (google.maps.GeocoderStatus.OK) {
          let country = '';
          const addressComponents = results[0].address_components;
          for (const addressComponent of addressComponents) {
            for (const type of addressComponent.types) {
              if (type === 'country') {
                country = addressComponent.long_name;
              }
            }
          }
          observer.next({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            country: country
          });
        } else {
          observer.error('Geocode was not successful for the following reason: ' + status);
        }
        observer.complete();
      });
    });
  }

  geocodeLatLng(position: google.maps.LatLng): Observable<object> {
    return Observable.create((observer: Observer<object>) => {
      this.geocoder.geocode({'location': position}, function (results, status) {
        if (google.maps.GeocoderStatus.OK) {
          observer.next({
            sourcePlaceName: results[0].formatted_address,
            sourceCountry: results[results.length - 1].formatted_address,
            country: results[results.length - 1].formatted_address.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          });
        } else {
          observer.error('Geocode was not successful for the following reason: ' + status);
        }
        observer.complete();
      });
    });
  }
}
