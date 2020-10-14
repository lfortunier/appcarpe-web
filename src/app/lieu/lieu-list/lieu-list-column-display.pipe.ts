import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lieuListColumnDisplay'
})
export class LieuListColumnDisplayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch(value){
      case 'name':
        return 'Nom';
      case 'nomVille':
        return 'Ville';
      case 'typeLieu':
        return 'Type de lieu';
      case 'departement':
        return 'Departement';
      case 'taille':
        return 'Taille (ha)';
      case 'modify':
      case 'delete':
        return '';
    }
    return '';
  }

}
