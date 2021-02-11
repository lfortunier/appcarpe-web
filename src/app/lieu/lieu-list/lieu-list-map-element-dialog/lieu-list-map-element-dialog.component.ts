import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {} from "googlemaps";

export interface MapData {
  longitude: number;
  latitude: number;
}

@Component({
  selector: 'app-lieu-list-map-element-dialog',
  templateUrl: './lieu-list-map-element-dialog.component.html',
  styleUrls: ['./lieu-list-map-element-dialog.component.css']
})
export class LieuListMapElementDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapElement: any;
  map: google.maps.Map;

  constructor(
    public dialogRef: MatDialogRef<LieuListMapElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapData) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    const position = new google.maps.LatLng(this.data.latitude, this.data.longitude)
    const mapProperties = {
      center: position,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    const marker = new google.maps.Marker({
      position: position,
      map: this.map,
      draggable: false
    });
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    marker.setMap(this.map);
  }
}
