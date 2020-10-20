import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LieuRoutingModule} from "./lieu-routing.module";
import {LieuListComponent} from './lieu-list/lieu-list.component';
import {SharedModule} from "../shared/shared-module";
import {LieuListColumnDisplayPipe} from './lieu-list/lieu-list-column-display.pipe';
import {TypeLieuLibellePipe} from "../shared/pipe/type-lieu-libelle.pipe";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LieuEditComponent} from './lieu-edit/lieu-edit.component';
import {MaterialModule} from "../materials/material.module";

@NgModule({
  imports: [
    CommonModule,
    LieuRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  declarations: [LieuListComponent, LieuListColumnDisplayPipe, LieuEditComponent],
  providers: [TypeLieuLibellePipe]
})
export class LieuModule {
}

