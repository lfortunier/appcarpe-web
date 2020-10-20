import {AutoCompleteCommuneDepartement} from "./auto-complete-commune-departement";

export interface AutoCompleteCommuneResult {
  "nom": string,
  "code": string,
  "codeDepartement": string,
  "codeRegion": string,
  "codesPostaux": string[],
  "population": number,
  "_score": number,
  "departement": AutoCompleteCommuneDepartement
}
