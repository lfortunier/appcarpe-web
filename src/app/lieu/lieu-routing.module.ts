import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LieuListComponent} from "./lieu-list/lieu-list.component";
import {LieuEditComponent} from "./lieu-edit/lieu-edit.component";

const routes: Routes = [
  {path: '', component: LieuListComponent},
  {path: 'edit/:idLieu', component: LieuEditComponent},
  {path: 'new', component: LieuEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LieuRoutingModule {
}
