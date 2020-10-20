import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../../shared/models/user";
import {Router} from "@angular/router";
import {DisplayMessageHandlerService} from "../../shared/display-message-handler/display-message-handler.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {AuthService} from "../../shared/services/auth.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerSubscribe: Subscription;
  matcher = new MyErrorStateMatcher();

  constructor(private http: HttpClient, private router: Router, private errorHandler: DisplayMessageHandlerService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.logout();
  }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ]),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
  }, {
    validators: this.passwordMatchValidator
  });

  submit() {
    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname
    } as User
    if (this.form.valid) {
      this.registerSubscribe = this.http.post(`${environment.url}auth/register`, user).subscribe(
        () => {
          this.router.navigate(["/login"]);
        }, error => {
          this.errorHandler.handlerError(error.error.errors);
        }
      )
    }
  }

  get inputEmail() {
    return this.form.get('email') as FormControl;
  }

  get inputPassword() {
    return this.form.get('password') as FormControl;
  }

  get inputConfirmPassword() {
    return this.form.get('confirmPassword') as FormControl;
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({NoPassswordMatch: true});
    } else {
      return null;
    }
  }

  ngOnDestroy(): void {
    if (this.registerSubscribe) {
      this.registerSubscribe.unsubscribe();
    }
  }

}
