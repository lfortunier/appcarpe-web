import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {DisplayMessageHandlerComponent} from "./display-message-handler.component";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DisplayMessageHandlerService {

  constructor(private _snackBar: MatSnackBar) {
  }

  handlerError(errors: any) {
    if (errors instanceof Array) {
      this.displayErrors(errors);
    } else if (errors.errors) {
      this.displayErrors(errors.errors);
    } else if (errors instanceof HttpErrorResponse && errors.error && errors.error.errors) {
      this.displayErrors(errors.error.errors);
    } else {
      const m = [];
      m[0] = "Erreur lors de l'appel au serveur";
      this.displayErrors(m);
    }

  }

  private displayErrors(errors: string[]) {
    this._snackBar.openFromComponent(DisplayMessageHandlerComponent, {
      data: errors,
      duration: 3000,
      panelClass: ['red-snackbar']
    });
  }

  private displayValidateMessage(messages: string[]) {
    this._snackBar.openFromComponent(DisplayMessageHandlerComponent, {
      data: messages,
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }

  handlerValidation(messages: any) {
    if (typeof messages === 'string') {
      const m = [];
      m[0] = messages;
      this.displayValidateMessage(m);
    } else if (messages instanceof Array) {
      this.displayValidateMessage(messages);
    } else {
      const m = [];
      m[0] = "Action effectué";
      this.displayValidateMessage(messages);
    }

  }
}
