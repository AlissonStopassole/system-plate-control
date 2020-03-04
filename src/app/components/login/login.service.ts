import { Injectable } from '@angular/core';

import { RequestService } from './../../services/requisicao/request.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private requestService: RequestService
  ) { }

  entrar(usuario: any): Promise<any> {
    return new Promise(sucesso => {
      this.requestService.salvar('sessao/autenticar', usuario)
        .then(resposta => sucesso(resposta))
        .catch(erro => console.error(erro));
    });
  }

  validarSessao(): Promise<any> {
    return new Promise(sucesso => {
      this.requestService.salvar('sessao/validar', { token: localStorage.getItem('token') })
        .then(resposta => sucesso(resposta))
        .catch(erro => console.error(erro));
    });
  }

}
