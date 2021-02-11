import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpBackend, HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TypeLieu} from "../../shared/models/type-lieu/type-lieu";
import {DisplayMessageHandlerService} from "../../shared/display-message-handler/display-message-handler.service";
import {Lieu} from "../../shared/models/lieu/lieu";
import {LieuService} from "../../shared/services/lieu.service";
import {AutoCompleteCommuneResult} from "../../shared/models/situation-geographique/auto-complete/auto-complete-commune-result";
import {AutoCompleteCommuneDepartement} from "../../shared/models/situation-geographique/auto-complete/auto-complete-commune-departement";
import {take} from "rxjs/operators";
import {faExchangeAlt} from "@fortawesome/free-solid-svg-icons";
import {} from "googlemaps";

@Component({
  selector: 'app-lieu-edit',
  templateUrl: './lieu-edit.component.html',
  styleUrls: ['./lieu-edit.component.css']
})
export class LieuEditComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('map') mapElement: any;
  map: google.maps.Map;
  marker = new google.maps.Marker;

  subscribeRoute: Subscription;
  lieu: Lieu = this.lieuService.newLieu;
  typesLieu: TypeLieu[];
  isAjout: boolean;

  filteredCodePostal: string[];
  filteredNomVille: AutoCompleteCommuneResult[];
  filteredDepartement: string[];

  allDepartement: AutoCompleteCommuneDepartement[];

  faExchangeAlt = faExchangeAlt;

  isSyncroMap = true;


  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private messageHandler: DisplayMessageHandlerService,
              private lieuService: LieuService,
              private router: Router,
              private httpBackend: HttpBackend) {
  }

  ngAfterViewInit(): void {
    const position = new google.maps.LatLng(46.3223, 2.2549)
    const mapProperties = {
      center: position,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.map.addListener('click', (evt) => {
      this.setSituationGeoByLatLong(evt.latLng.lat(), evt.latLng.lng());
      this.setMarker(evt.latLng.lat(), evt.latLng.lng());
    })
  }

  ngOnInit(): void {
    this.subscribeRoute = this.activatedRoute.params.subscribe(params => {
      const id = params['idLieu'];
      if (id) {
        this.http.get(`${environment.url}lieu/${id}`)
          .pipe(take(1))
          .subscribe(
            (lieu: Lieu) => {
              this.lieu = lieu;
              this.isAjout = false;
              this.isSyncroMap = !!this.lieu.synchronisationMap;
              if (this.lieu.latitude && this.lieu.longitude) {
                this.setMapCenterByCoord(this.lieu.latitude, this.lieu.longitude);
                this.setMarker(this.lieu.latitude, this.lieu.longitude);
              } else {
                this.setMapCenterBySituationGeographique()
              }
            }, error => this.messageHandler.handlerError(error)
          )

      } else {
        this.isAjout = true;
      }
    });
    this.http.get(`${environment.url}type_lieu`)
      .pipe(take(1)).subscribe(
      (types: TypeLieu[]) => this.typesLieu = types, error => this.messageHandler.handlerError(error)
    )
    this.http.get(`https://geo.api.gouv.fr/departements`)
      .pipe(take(1))
      .subscribe((response: AutoCompleteCommuneDepartement[]) => {
        this.allDepartement = response;
        this.filteredDepartement = this.allDepartement.map(d => d.nom);
      });
  }

  ngOnDestroy() {
    if (this.subscribeRoute) {
      this.subscribeRoute.unsubscribe();
    }
  }

  get title() {
    if (!!this.isAjout) {
      return "Ajout d'un lieu"
    } else {
      return "Modification d'un lieu"
    }
  }

  onSubmit(f) {
    if (this.marker && this.marker.getPosition()) {
      this.lieu.longitude = this.marker.getPosition().lng();
      this.lieu.latitude = this.marker.getPosition().lat();
    }
    this.lieu.synchronisationMap = this.isSyncroMap;
    if (!this.lieu.session) {
      this.lieu.prix24 = null;
    }
    if (!this.lieu.journee) {
      this.lieu.prixJournee = null;
    }
    this.http.post(`${environment.url}lieu/edit`, this.lieu).pipe(take(1)).subscribe(
      () => {
        let message = 'Le lieu a bien été ';
        if (this.isAjout) {
          message = message + 'créé'
        } else {
          message = message + 'modifié'
        }
        this.messageHandler.handlerValidation(message);
        this.router.navigate(['lieu'])
      }, error => {
        this.messageHandler.handlerError(error);
      }
    );
  }

  onSelectedCodePostal(value: any) {
    if (value.length === 5) {
      this.http.get(`https://geo.api.gouv.fr/communes?codePostal=${value}`).pipe(take(1)).subscribe((response: AutoCompleteCommuneResult[]) => {
        if (response.length > 1) {
          this.filteredNomVille = response;
          this.lieu.situationGeographique.nomVille = '';
          this.lieu.situationGeographique.departement = '';
        } else if (response.length === 1) {
          this.setDepartement(response[0]);
          this.lieu.situationGeographique.nomVille = response[0].nom;
          this.lieu.situationGeographique.codePostal = value;
        }
        this.setMapCenterBySituationGeographique();
      });
    } else {
      this.filteredCodePostal = [];
    }
  }

  onChangeNomVille(value: any) {
    this.http.get(`https://geo.api.gouv.fr/communes?nom=${value}&fields=departement&boost=population&limit=5`).pipe(take(1)).subscribe((response: AutoCompleteCommuneResult[]) => {
      this.filteredNomVille = response;
    });
  }

  onSelectedNomVille(value: any) {
    const searchByName: AutoCompleteCommuneResult = value.option.value;
    this.setDepartement(searchByName);
    this.lieu.situationGeographique.nomVille = searchByName.nom;
    this.http.get(`https://geo.api.gouv.fr/communes/${searchByName.code}`).pipe(take(1)).subscribe((response: AutoCompleteCommuneResult) => {
      if (response.codesPostaux.length > 1) {
        this.filteredCodePostal = response.codesPostaux;
        this.lieu.situationGeographique.codePostal = '';
      } else {
        this.lieu.situationGeographique.codePostal = response.codesPostaux[0];
        this.filteredCodePostal = [];
      }
      this.setMapCenterBySituationGeographique();
    });
  }

  onChangeDepartement(value: any) {
    const filterValue = value.toLowerCase();
    this.filteredDepartement = this.allDepartement.filter(d => d.nom.toLowerCase().indexOf(filterValue) === 0).map(d => d.nom);
  }

  displayNomVille(resu: AutoCompleteCommuneResult) {
    return resu?.nom;
  }

  displayAutoCompleteNomVille(result: AutoCompleteCommuneResult) {
    let codePostal;
    if (result.codeDepartement) {
      codePostal = result.codeDepartement;
    } else {
      codePostal = result.departement?.code;
    }

    if (codePostal) {
      return `${result.nom} (${codePostal})`
    }

    return result.nom
  }

  setDepartement(complete: AutoCompleteCommuneResult): string {
    if (complete) {
      if (complete.departement && complete.departement.nom) {
        this.lieu.situationGeographique.departement = complete.departement.nom;
      } else if (complete.codeDepartement) {
        this.lieu.situationGeographique.departement = this.allDepartement.filter(d => d.code === complete.codeDepartement).map(d => d.nom).reduce(d => d);
      }
    }
    return '';
  }

  get typeLieuId() {
    if (this.lieu && this.lieu.typeLieu) {
      return this.lieu.typeLieu.id;
    }
    return null;
  }

  set typeLieuId(id: number) {
    this.lieu.typeLieu = this.typesLieu.filter(t => t.id === id).reduce(p => p);
  }

  setMapCenterBySituationGeographique() {
    if (this.isSyncroMap) {
      const httpBackend = new HttpClient(this.httpBackend);
      const optionQ = `q=${this.lieu.situationGeographique.nomVille}`;
      const optionType = `type=municipality`;
      if (this.lieu.situationGeographique.nomVille && this.lieu.situationGeographique.codePostal) {
        const url = `https://api-adresse.data.gouv.fr/search/?${optionQ}&${optionType}`;
        httpBackend.get(url)
          .pipe(take(1))
          .subscribe((response) => {
            const ville = response['features'].find(o => {
              const info = o['properties'];
              return info['city'] === this.lieu.situationGeographique.nomVille && info['postcode'] === this.lieu.situationGeographique.codePostal;
            });
            this.setMapCenterByCoord(ville['geometry']['coordinates'][1], ville['geometry']['coordinates'][0]);
          });
      }
    }
  }

  setMapCenterByCoord(lon: number, lat: number) {
    const pos = new google.maps.LatLng(lon, lat)
    this.map.setCenter(pos);
    this.map.setZoom(14);
  }

  setSituationGeoByLatLong(lat: number, lon: number) {
    if (this.isSyncroMap) {
      const httpBackend = new HttpClient(this.httpBackend);
      const optionlat = `lon=${lon}`;
      const optionlon = `lat=${lat}`;
      if (lat && lon) {
        const url = `https://api-adresse.data.gouv.fr/reverse/?${optionlon}&${optionlat}`;
        httpBackend.get(url)
          .pipe(take(1))
          .subscribe((response) => {
            if (response['features'] && response['features'].length > 0) {
              const item = response['features'][0]['properties'];
              this.lieu.situationGeographique.nomVille = item['city']
              this.lieu.situationGeographique.codePostal = item['postcode']
              const departement = item['context'].split(', ');
              this.lieu.situationGeographique.departement = departement[1];
            }
          });
      }
    }
  }

  setMarker(lat: number, lon: number) {
    this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      map: this.map,
      draggable: true
    });
    this.marker.setMap(this.map);
  }

  clickSyncroMap() {
    this.isSyncroMap = !this.isSyncroMap;
  }
}
