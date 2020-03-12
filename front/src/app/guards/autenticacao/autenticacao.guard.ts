import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseAuth } from 'angularfire2';
import { RequestService } from 'src/app/services/requisicao/request.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoGuard implements CanActivate {

  config = new MatSnackBarConfig();

  constructor(
    private router: Router,
    public _afAuth: AngularFireAuth,
    public requisicao: RequestService,
    private _snackBar: MatSnackBar,
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise(sucesso => {
      if (localStorage.getItem('token') && localStorage.getItem('token').length) {
        this.requisicao.salvar(`usuario/auth`, { token: localStorage.getItem('token') }).then(response => {
          if (JSON.parse(response.message)) {
            sucesso(true);
          } else {
            this.router.navigate(['/']);
            sucesso(false);
            this.config.duration = 5000;
            this.config.panelClass = ['danger'];
            this._snackBar.open('Autenticação Inválida', undefined, this.config);
          }
        });
      } else {
        this.router.navigate(['/']);
        sucesso(false);
        this.config.duration = 5000;
        this.config.panelClass = ['danger'];
        this._snackBar.open('Autenticação Inválida', undefined, this.config);
      }
    });
  }
}
