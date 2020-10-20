import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {User} from "../shared/models/user";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
