import {Lieu} from "./lieu/lieu";

export interface SituationGeographique {
  id: number,
  nomVille: string,
  codePostal: string,
  departement: string,
  lieux: Lieu[]
}
