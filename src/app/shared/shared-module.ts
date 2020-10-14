import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {TypeLieuLibellePipe} from "./pipe/type-lieu-libelle.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        TypeLieuLibellePipe
    ],
    declarations: [
        TypeLieuLibellePipe
    ]
})
export class SharedModule {
}
