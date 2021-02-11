import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {DisplayMessageHandlerService} from "../../shared/display-message-handler/display-message-handler.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TypeLieuLibellePipe} from "../../shared/pipe/type-lieu-libelle.pipe";
import {faEdit, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Lieu} from "../../shared/models/lieu/lieu";
import {Router} from "@angular/router";
import {CustomPaginator} from "../../materials/customPaginatorConfiguration";
import {MatDialog} from "@angular/material/dialog";
import {LieuListMapElementDialogComponent} from "./lieu-list-map-element-dialog/lieu-list-map-element-dialog.component";

interface LieuListElement {
  id: number,
  name: string,
  prix24: number,
  prixJournee: number,
  journee: boolean,
  session_: boolean,
  bateauAmorceur: boolean,
  navigation_: boolean,
  taille: number,
  siteInternet: string,
  nombrePoste: number,
  commentaire: string,
  nomVille: string,
  departement: string,
  codePostal: string,
  typeLieu: string,
  longitude: number,
  latitude: number
}

@Component({
  selector: 'app-lieu-list',
  templateUrl: './lieu-list.component.html',
  styleUrls: ['./lieu-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ], providers: [
    {provide: MatPaginatorIntl, useValue: CustomPaginator()}
  ]
})
export class LieuListComponent implements OnInit, OnDestroy {

  lieuSubscription: Subscription
  deleteSubscription: Subscription
  listeLieux: LieuListElement[] = [];
  displayedColumns: string[] = ['name', 'departement', 'nomVille', 'typeLieu', 'taille', 'modify', 'delete'];
  dataSource: MatTableDataSource<LieuListElement>;
  expandedElement: LieuListElement | null;
  plusIcon = faPlus;
  faEdit = faEdit;
  faTimes = faTimes;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient,
              private messageHandler: DisplayMessageHandlerService,
              private typeLieuPipe: TypeLieuLibellePipe,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    if (this.lieuSubscription) {
      this.lieuSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initData(lieux: Lieu[]) {
    this.listeLieux = lieux.map(l => this.transformLieuinLieuListElement(l));
    this.dataSource = new MatTableDataSource(this.listeLieux);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private transformLieuinLieuListElement(lieu: Lieu): LieuListElement {
    return {
      id: lieu.id,
      name: lieu.name,
      prix24: lieu.prix24,
      prixJournee: lieu.prixJournee,
      journee: lieu.journee,
      session_: lieu.session,
      bateauAmorceur: lieu.bateauAmorceur,
      navigation_: lieu.navigation,
      taille: lieu.taille,
      siteInternet: lieu.siteInternet,
      nombrePoste: lieu.nombrePoste,
      commentaire: lieu.commentaire,
      nomVille: lieu.situationGeographique?.nomVille,
      departement: lieu.situationGeographique?.departement,
      codePostal: lieu.situationGeographique?.codePostal,
      typeLieu: this.typeLieuPipe.transform(lieu.typeLieu?.libelle),
      latitude: lieu.latitude,
      longitude: lieu.longitude
    } as LieuListElement;
  }

  doNothingOnClick() {
    return false;
  }

  onModify(element: LieuListElement) {
    this.router.navigate(['lieu', 'edit', element.id]);
  }

  onDelete(element: LieuListElement) {
    this.deleteSubscription = this.http.delete(`${environment.url}lieu/delete/${element.id}`, {headers: {'Content-Type': 'application/json'}}).subscribe(
      () => {
        this.messageHandler.handlerValidation('Le lieu a été supprimé');
        this.init();
      }, error => {
        this.messageHandler.handlerError(error)
      }
    )
  }

  init() {
    this.lieuSubscription = this.http.get(`${environment.url}lieu`).subscribe(
      (data: Lieu[]) => {
        this.initData(data);
      }, error => {
        this.messageHandler.handlerError(error);
      }
    )
  }

  openDialog(element): void {
    if (element.longitude && element.latitude) {
      this.dialog.open(LieuListMapElementDialogComponent, {
        width: '100%',
        data: {longitude: element.longitude, latitude: element.latitude}
      });
    }
  }
}
