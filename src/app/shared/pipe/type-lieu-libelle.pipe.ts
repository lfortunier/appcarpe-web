import {Pipe, PipeTransform} from '@angular/core';
import {TypeLieuEnum} from "../models/type-lieu/type-lieu-enum";

@Pipe({
  name: 'typeLieuLibelle'
})
export class TypeLieuLibellePipe implements PipeTransform {

  transform(value: TypeLieuEnum, ...args: unknown[]): string {
    switch (value) {
      case TypeLieuEnum.COMMUNAL:
        return 'Communal';
      case TypeLieuEnum.INCONNUE:
        return 'Inconnue';
      case TypeLieuEnum.PRIVER:
        return 'Priver';
      case TypeLieuEnum.PUBLIC:
        return 'Public';
      default:
        return '';
    }
  }

}
