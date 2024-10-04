import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { OSM, XYZ } from 'ol/source';
import { Feature, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control'
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Point } from 'ol/geom';
import { defaults as defaultInteractions, Interaction } from 'ol/interaction';
@Component({
  selector: 'app-open-layer',
  templateUrl: './open-layer.component.html',
  styleUrl: './open-layer.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OpenLayerComponent implements OnChanges {
  map: Map;
  @Input() latitude_longitude: any;
  vectorLayer;
  locationaccess;
  vectorSource;


  ngOnChanges(changes: SimpleChanges): void {
    this.map_initialization()
  }


  map_initialization() {

    let coordinates = [parseFloat(this.latitude_longitude.split('#')[0]), parseFloat(this.latitude_longitude.split('#')[1])]

    this.locationaccess = new Feature({
      geometry: new Point(fromLonLat(coordinates))
    });


    this.locationaccess.setStyle(new Style({
      image: new Icon(({
        color: 'red',
        crossOrigin: 'anonymous',
        src: '../assets/maps/Idle.png',
      }))
    }));

    this.vectorSource = new VectorSource({
      features: [this.locationaccess]
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });



    this.map = new Map({
      target: 'map',
      layers: [new TileLayer({
        source: new OSM(
          {
            url: 'https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
          }
        )
      }), this.vectorLayer],
      view: new View({
        center: fromLonLat(coordinates),
        zoom: 15
      }),
      controls: defaultControls({ attribution: true }),
      interactions: defaultInteractions({ mouseWheelZoom: false })
    });
  }

}
