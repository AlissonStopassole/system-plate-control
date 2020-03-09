import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-veicles',
  templateUrl: './veicles.component.html',
  styleUrls: ['./veicles.component.css']
})
export class VeiclesComponent implements OnInit {
  veicle = {
    modelo: '',
    ano: '',
    cor: '',
    cidade: '',
    estado: '',
    placaNova: false,
    numeroPlaca: '',
  }

  anos = [];
  cidades = [];
  estados = [];

  modeloControl = new FormControl('', [Validators.required]);
  anoControl = new FormControl('', [Validators.required]);
  corControl = new FormControl('', [Validators.required]);
  cidadeControl = new FormControl('');
  estadoControl = new FormControl('');
  numeroPlacaControl = new FormControl('', [Validators.required]);

  veicleForm: FormGroup = new FormGroup({
    modelo: this.modeloControl,
    ano: this.anoControl,
    cor: this.corControl,
    cidade: this.cidadeControl,
    estado: this.estadoControl,
    numeroPlaca: this.numeroPlacaControl,
  });


  constructor(
    private router: Router,
    public emitterComponentService: EmitterComponentService
  ) {
    var anoAtual = new Date().getFullYear();
    for (let i = 0; i < 100; i++) {
      this.anos.push(anoAtual - i);
    }
  }

  ngOnInit(): void {
  }

  salvar() {
    console.log(this.veicleForm.value);

  }

  clearStorage() {
    this.router.navigate(['/home']);
    this.emitterComponentService.emit(0);
  }
}
