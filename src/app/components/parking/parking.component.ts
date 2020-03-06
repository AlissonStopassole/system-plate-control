import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.css']
})
export class ParkingComponent implements OnInit {
  parking = {
    nome: '',
    qtdVagas: '',
    precoVaga: '',
  }

  nomeControl = new FormControl('', [Validators.required]);
  qtdVagasControl = new FormControl('', [Validators.required]);
  precoVagaControl = new FormControl('', [Validators.required])

  parkingForm: FormGroup = new FormGroup({
    nome: this.nomeControl,
    sobrenome: this.qtdVagasControl,
    email: this.precoVagaControl,
  });

  constructor(
    private router: Router,
    public emitterComponentService: EmitterComponentService
  ) { }

  ngOnInit(): void {
  }

  salvar() {

  }

  clearStorage() {
    this.router.navigate(['/home']);
    this.emitterComponentService.emit(0);
  }

}
