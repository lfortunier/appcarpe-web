import {TypeLieuEnum} from "./type-lieu-enum";
import {Lieu} from "../lieu/lieu";

export interface TypeLieu {
  id: number,
  libelle: TypeLieuEnum,
  lieux: Lieu[]
}
