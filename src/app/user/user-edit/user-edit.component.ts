import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../../shared/models/user";
import {DisplayMessageHandlerService} from "../../shared/display-message-handler/display-message-handler.service";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {

  getUserSubscribe: Subscription;
  postUserSubscribe: Subscription;
  user: User = null;

  constructor(private http: HttpClient,
              private messageHandler: DisplayMessageHandlerService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getUserSubscribe = this.http.get(`${environment.url}user`).subscribe(
      (user: User) => {
        this.user = user;
      }, error => {
        this.messageHandler.handlerError(error);
      }
    )
  }

  onSubmit() {
    this.postUserSubscribe = this.http.patch(`${environment.url}user/edit`, this.user).subscribe((user:User) => {
      this.messageHandler.handlerValidation("L'utilisateur a bien été modifié");
      this.router.navigate(['lieu']);
      this.authService.user = user;
    }, error => {
      this.messageHandler.handlerError(error);
    });
  }

  ngOnDestroy(): void {
    if (this.getUserSubscribe) {
      this.getUserSubscribe.unsubscribe();
    }
    if (this.postUserSubscribe) {
      this.postUserSubscribe.unsubscribe();
    }
  }

}
