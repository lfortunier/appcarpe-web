import {MatPaginatorIntl} from "@angular/material/paginator";

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Item par page:';

  return customPaginatorIntl;
}
