import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {shareReplay, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLogged: User;
  isLogged: boolean = false;

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    const user = {
      email: email,
      password: password
    }as User
    return this.http.post<any>(`${environment.url}auth/login`, user,{observe: 'response'})
      .pipe(
        tap(resp => {
          AuthService.setSession(resp.headers.get('Authorization'));
        })
        ,shareReplay()
      );
  }

  private static setSession(token: string) {
    localStorage.setItem('user_token', token);
  }

  logout() {
    localStorage.removeItem("user_token");
    this.isLogged = false;
    this.userLogged = null;
  }

  get user(){
    return this.userLogged;
  }

  set user(user: User){
    this.userLogged = user;
  }
}
