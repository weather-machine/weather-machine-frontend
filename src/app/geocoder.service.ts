import { Injectable } from '@angular/core';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  geocoder: any;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  geocodeAddress(address: string) {
    const result = {
      lat: null,
      lng: null
    };

    this.geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        result.lat = results[0].geometry.location.lat();
        result.lng = results[0].geometry.location.lng();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

    return result;
  }
}
