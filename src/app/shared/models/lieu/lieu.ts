import {SituationGeographique} from "../situation-geographique/situation-geographique";
import {TypeLieu} from "../type-lieu/type-lieu";

export interface Lieu {
  id: number,
  name: string,
  prix24: number,
  prixJournee: number,
  journee: boolean,
  session: boolean,
  bateauAmorceur: boolean,
  navigation: boolean,
  taille: number,
  siteInternet: string,
  nombrePoste: number,
  commentaire: string,
  situationGeographique: SituationGeographique,
  typeLieu: TypeLieu
}
