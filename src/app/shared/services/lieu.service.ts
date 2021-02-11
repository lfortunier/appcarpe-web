import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LieuService {

  constructor() {
  }

  get newLieu() {
    return {
      id: null,
      name: null,
      prix24: null,
      prixJournee: null,
      journee: null,
      session: null,
      bateauAmorceur: null,
      navigation: null,
      taille: null,
      siteInternet: null,
      nombrePoste: null,
      commentaire: null,
      longitude: null,
      latitude: null,
      situationGeographique: {
        id: null,
        nomVille: null,
        codePostal: null,
        departement: null,
        lieux: null
      },
      typeLieu: null,
      synchronisationMap: true
    }
  }
}
