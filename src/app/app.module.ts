import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './auth/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from "./auth/register/register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MenuComponent} from "./menu/menu.component";
import {DisplayMessageHandlerComponent} from "./shared/display-message-handler/display-message-handler.component";
import {SharedModule} from "./shared/shared-module";
import {AuthInterceptor} from "./shared/services/auth-interceptor";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {MaterialModule} from "./materials/material.module";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {CustomPaginator} from "./materials/customPaginatorConfiguration";
import { UserEditComponent } from './user/user-edit/user-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MenuComponent,
    DisplayMessageHandlerComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    {provide: MatPaginatorIntl, useValue: CustomPaginator()}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
