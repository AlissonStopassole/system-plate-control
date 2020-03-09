import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/requisicao/request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  vagas = 0;

  constructor(
    public requisicao: RequestService,
  ) { }

  ngOnInit(): void {
    this.requisicao.buscar('estacionamento').then(response => {
      if (response.message.length) {
        this.vagas = response.message[0].qtdVagas;
      }
    });
  }



}
