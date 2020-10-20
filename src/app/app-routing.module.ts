import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AuthGuard} from "./shared/services/auth-guard";
import {UserEditComponent} from "./user/user-edit/user-edit.component";
import {AccueilComponent} from "./accueil/accueil.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'lieu',
    loadChildren: () => import('./lieu/lieu.module').then(m => m.LieuModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    component: UserEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accueil',
    component: AccueilComponent,
    canActivate: [AuthGuard]
  },
  {path: '**', redirectTo: 'accueil'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
