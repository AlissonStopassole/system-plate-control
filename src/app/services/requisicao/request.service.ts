import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(
        private httpClient: HttpClient
    ) { }

    private enderecoBase(api: string): string {
        let endereco = '';
        if (location.host === 'app.leigado.com.br') {
            endereco = 'https://api.leigado.com.br/';
        } else if (location.host === 'app.beta.leigado.com.br' || localStorage.getItem('beta')) {
            endereco = 'https://api.beta.leigado.com.br/';
        } else {
            endereco = 'http://localhost:3000/';
        }
        if (api == 'java') {
            endereco += 'api/';
        }
        return endereco;
    }

    public buscar(enderecoConsumo: string, api: string = 'java'): Promise<any> {
        return new Promise(sucesso => {
            this.httpClient.get(`${this.enderecoBase(api)}${enderecoConsumo}`, { headers: new HttpHeaders().set('token', localStorage.getItem('token') || '').set('Content-Type', 'application/json') })
                .subscribe(resposta => sucesso(resposta));
        });
    }

    public salvar(enderecoConsumo: string, item: any, api: string = 'java'): Promise<any> {
        return new Promise(sucesso => {
            this.httpClient.post(`${this.enderecoBase(api)}${enderecoConsumo}`, item, { headers: new HttpHeaders().set('token', localStorage.getItem('token') || '').set('Content-Type', 'application/json') })
                .subscribe(resposta => sucesso(resposta));
        });
    }
}
