import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  isLogged() {
    return this.authService.isLogged;
  }

  getFirstnameLogged() {
    return this.authService.user.firstname;
  }

  loggout() {
    return this.authService.logout();
  }

}
