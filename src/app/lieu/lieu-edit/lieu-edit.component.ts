import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TypeLieu} from "../../shared/models/type-lieu/type-lieu";
import {DisplayMessageHandlerService} from "../../shared/display-message-handler/display-message-handler.service";
import {Lieu} from "../../shared/models/lieu/lieu";
import {LieuService} from "../../shared/services/lieu.service";
import {AutoCompleteCommuneResult} from "../../shared/models/situation-geographique/auto-complete/auto-complete-commune-result";
import {AutoCompleteCommuneDepartement} from "../../shared/models/situation-geographique/auto-complete/auto-complete-commune-departement";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-lieu-edit',
  templateUrl: './lieu-edit.component.html',
  styleUrls: ['./lieu-edit.component.css']
})
export class LieuEditComponent implements OnInit, OnDestroy {

  subscribeRoute: Subscription;
  lieu: Lieu = this.lieuService.newLieu;
  typesLieu: TypeLieu[];
  isAjout: boolean;

  filteredCodePostal: string[];
  filteredNomVille: AutoCompleteCommuneResult[];
  filteredDepartement: string[];

  allDepartement: AutoCompleteCommuneDepartement[];

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private messageHandler: DisplayMessageHandlerService,
              private lieuService: LieuService,
              private router: Router) {
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
}
