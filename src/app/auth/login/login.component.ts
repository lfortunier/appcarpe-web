import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {DisplayMessageHandlerService} from "../../shared/display-message-handler/display-message-handler.service";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginSubscribe: Subscription;

  constructor(private authService: AuthService, private errorHandler: DisplayMessageHandlerService,private router:Router) {
  }

  ngOnInit(): void {
  }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.loginSubscribe = this.authService.login(this.form.value.email, this.form.value.password).subscribe(user => {
        this.authService.user = user.body.user;
        this.authService.isLogged = true;
        this.router.navigate(["/lieu"]);
      }, request => {
        this.errorHandler.handlerError(request.error.errors)
      })
    }
  }

  ngOnDestroy(): void {
    if (this.loginSubscribe) {
      this.loginSubscribe.unsubscribe();
    }
  }

}
