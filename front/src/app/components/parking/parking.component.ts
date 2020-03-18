import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';
import { RequestService } from 'src/app/services/requisicao/request.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.css']
})
export class ParkingComponent implements OnInit {
  parking = {
    nome: '',
    qtdVagas: 0,
    precoVaga: 0,
  }

  nomeControl = new FormControl('', [Validators.required]);
  qtdVagasControl = new FormControl('', [Validators.required]);
  precoVagaControl = new FormControl('', [Validators.required])

  parkingForm: FormGroup = new FormGroup({
    _id: new FormControl(),
    nome: this.nomeControl,
    qtdVagas: this.qtdVagasControl,
    precoVaga: this.precoVagaControl,
  });

  config = new MatSnackBarConfig();

  constructor(
    private router: Router,
    public emitterComponentService: EmitterComponentService,
    public requisicao: RequestService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.buscar();
  }

  salvar() {
    this.parking['idUsuario'] = Number(localStorage.getItem('user'));
    this.requisicao.salvar('estacionamento', this.parking).then((response) => {
      if (response.status === 0) {
        this.config.duration = 5000;
        this._snackBar.open(response.message, undefined, this.config);
      } else {
        this.buscar();
        this.config.duration = 5000;
        this._snackBar.open(response.message, undefined, this.config);
      }
    });
  }

  buscar() {
    this.requisicao.buscar(`estacionamento-usuario/${Number(localStorage.getItem('user'))}`).then(response => {
      if (response.status === 0) {
        this.parking = response.message[0];
      } else {
        this.config.duration = 5000;
        this._snackBar.open('Falha ao buscar.', undefined, this.config);
      }
    });
  }

  clearStorage() {
    this.router.navigate(['/home']);
    this.emitterComponentService.emit(0);
  }

}
