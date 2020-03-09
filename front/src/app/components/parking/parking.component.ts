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
    console.log(this.parking);

    this.requisicao.salvar('estacionamento', this.parking).then(() => {
      this._snackBar.open('Salvo com sucesso.', undefined, this.config);
    });
  }

  buscar() {
    this.requisicao.buscar('estacionamento').then(response => {
      if (response.message.length) {
        this.parking = response.message[0];
      }
    });
  }

  clearStorage() {
    this.router.navigate(['/home']);
    this.emitterComponentService.emit(0);
  }

}
