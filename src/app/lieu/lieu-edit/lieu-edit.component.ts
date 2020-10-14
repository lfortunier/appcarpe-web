import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TypeLieu} from "../../shared/models/type-lieu/type-lieu";
import {DisplayMessageHandlerService} from "../../shared/display-message-handler/display-message-handler.service";
import {Lieu} from "../../shared/models/lieu/lieu";
import {LieuService} from "../../shared/services/lieu.service";

@Component({
  selector: 'app-lieu-edit',
  templateUrl: './lieu-edit.component.html',
  styleUrls: ['./lieu-edit.component.css']
})
export class LieuEditComponent implements OnInit, OnDestroy {

  subscribeRoute: Subscription;
  subscribeFindLieu: Subscription;
  subscribeType: Subscription;
  subscribeEditLieu: Subscription;
  lieu: Lieu;
  typesLieu: TypeLieu[];
  isAjout: boolean;

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
        this.subscribeFindLieu = this.http.get(`${environment.url}lieu/${id}`).subscribe(
          (lieu: Lieu) => {
            this.lieu = lieu;
            this.isAjout = false;
          }, error => this.messageHandler.handlerError(error)
        )

      } else {
        this.lieu = this.lieuService.newLieu
        this.isAjout = true;
      }
    });
    this.subscribeType = this.http.get(`${environment.url}type_lieu`).subscribe(
      (types: TypeLieu[]) => this.typesLieu = types, error => this.messageHandler.handlerError(error)
    )
  }

  ngOnDestroy() {
    if (this.subscribeRoute) {
      this.subscribeRoute.unsubscribe();
    }
    if (this.subscribeType) {
      this.subscribeType.unsubscribe();
    }
    if (this.subscribeFindLieu) {
      this.subscribeFindLieu.unsubscribe();
    }
    if (this.subscribeEditLieu) {
      this.subscribeEditLieu.unsubscribe();
    }
  }

  get title() {
    if (!!this.isAjout) {
      return "Ajout d'un lieu"
    } else {
      return "Modification d'un lieu"
    }
  }

  onSubmit() {
    this.subscribeEditLieu = this.http.post(`${environment.url}lieu/edit`, this.lieu).subscribe(
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

}
