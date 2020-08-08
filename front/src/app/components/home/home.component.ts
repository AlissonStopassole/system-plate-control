import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/requisicao/request.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  vagas = 0;
  idEstacionamento;
  vagasOcupadas = 0;

  config = new MatSnackBarConfig();

  constructor(
    public requisicao: RequestService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private emitterComponentService: EmitterComponentService,
  ) { }

  ngOnInit(): void {
    this.requisicao.buscar(`estacionamento-usuario/${Number(localStorage.getItem('user'))}`).then(response => {
      if (response.status === 0) {
        if (response.message.length) {
          this.vagas = response.message[0].qtdVagas;
          this.idEstacionamento = response.message[0]._id;
        }
      } else {
        this.config.duration = 5000;
        this._snackBar.open('Falha ao buscar.', undefined, this.config);
      }
    }).then(() => {
      if (this.idEstacionamento) {
        this.requisicao.buscar(`vagas/${this.idEstacionamento}`).then(response => {
          if (response.status === 0) {
            this.vagasOcupadas = response.message[0].qtdVagas;
          } else {
            this.config.duration = 5000;
            this._snackBar.open('Falha ao buscar.', undefined, this.config);
          }
        });
      }
    });
  }

  navigate(id: number): void {
    if (id === 1) {
      this.router.navigate(['/home/parking']);
      this.emitterComponentService.emit(1);
      localStorage.setItem('tela', '1');
    } else {
      this.router.navigate(['/home/veicles-parking']);
      this.emitterComponentService.emit(4);
      localStorage.setItem('tela', '4');
    }
  }
}
