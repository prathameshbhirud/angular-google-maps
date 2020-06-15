import { Component, Input, ViewChild, NgZone, OnInit, Output } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';

import { IMarker } from './../IMarker';
import { ILocation } from './../ILocation';
import { Address } from './../IAddress';
import { Observable, of } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  geocoder: any;
  public origin: any
  public destination: any

  start: any;
  dest: any;

  public location: ILocation = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 5
  }

  @ViewChild(AgmMap) map: AgmMap;

  constructor(
    public mapsApiLoader: MapsAPILoader,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper
  ) { 
      this.mapsApiLoader = mapsApiLoader;
      this.zone = zone;
      this.wrapper = wrapper;
      this.mapsApiLoader.load().then(() => {
        this.geocoder = new google.maps.Geocoder();
      });
  }

  ngOnInit() {
    this.location.marker.draggable = true;
  }

  updateOnMap(){
    let fullAddress: string = this.location.address_level_1 || "";
    if (this.location.address_level_2) 
      fullAddress = fullAddress + " " + this.location.address_level_2;
    if (this.location.address_state) 
      fullAddress = fullAddress + " " + this.location.address_state;
    if (this.location.address_country) 
      fullAddress = fullAddress + " " + this.location.address_country;

    this.findLocation(fullAddress);
  }

  findLocation(address: string){
    if (!this.geocoder) 
      this.geocoder = new google.maps.Geocoder();

    this.geocoder.geocode({
      'address': address
    }, 
    (result, status) => {
      console.log(result);
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < result[0].address_components.length; i++) {
          let types = result[0].address_components[i].types
 
          if (types.indexOf('locality') != -1) {
            this.location.address_level_2 = result[0].address_components[i].long_name
          }
          if (types.indexOf('country') != -1) {
            this.location.address_country = result[0].address_components[i].long_name
          }
          if (types.indexOf('postal_code') != -1) {
            this.location.address_zip = result[0].address_components[i].long_name
          }
          if (types.indexOf('administrative_area_level_1') != -1) {
            this.location.address_state = result[0].address_components[i].long_name
          }
        }
 
        if (result[0].geometry.location) {
          this.location.lat = result[0].geometry.location.lat();
          this.location.lng = result[0].geometry.location.lng();
          this.location.marker.lat = result[0].geometry.location.lat();
          this.location.marker.lng = result[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = result[0].geometry.viewport;
        }
        
        this.map.triggerResize();
      } else {
        alert("Sorry, this search produced no results.");
      }
    });
  }

  markerDragEnd(event: any) {
    this.location.marker.lat = event.coords.lat;
    this.location.marker.lng = event.coords.lng;
    this.findAddressByCoordinates();
   }

   findAddressByCoordinates() {
    this.geocoder.geocode({
      'location': {
        lat: this.location.marker.lat,
        lng: this.location.marker.lng
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results);
    })
  }

  decomposeAddressComponents(addressArray) {
    if (addressArray.length == 0) 
      return false;
    let address = addressArray[0].address_components;
 
    for(let element of address) {
      if (element.length == 0 && !element['types']) continue
 
      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];
        continue;
      }
    }
  }

  getDirections(){
    // this.origin = this.getGeoLocation(this.start);
    // this.destination = this.getGeoLocation(this.dest);
    this.origin = { lat: 24.799448, lng: 120.979021 }
    this.destination = { lat: 24.799524, lng: 120.975017 }
  }

  getGeoLocation(address: string): {lat: number, lng: number}{
    let output: { lat: number, lng: number} = { lat: 0, lng: 0 };
    this.geocoder.geocode({
      'address': address
    },
    (result, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        output.lat = result[0].geometry.location.lat();
        output.lng = result[0].geometry.location.lng();
        console.log(output.lat);
      } 
    });
    return output;
  }
}
