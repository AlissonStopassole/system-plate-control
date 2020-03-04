import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/components/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService,

  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token') && localStorage.getItem('token').length === 24) {
      this.loginService.validarSessao()
        .then(resposta => {
          if (resposta.status === 0) {
            if (resposta.message.tipoUsuario === "administrador") {
              return true;
            } else {
              this.router.navigate(['/']);
              return false;
            }
          } else {
            this.router.navigate(['/']);
            return false;
          }
        });
      return true;
    } else {
      this.router.navigate(['/']);

      return false
    }
  }
}
