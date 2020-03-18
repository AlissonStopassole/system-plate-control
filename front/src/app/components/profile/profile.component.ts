import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';
import { RequestService } from 'src/app/services/requisicao/request.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = {
    email: '',
    nome: '',
    sobrenome: '',
    cpf: '',
    dtNascimento: null,
    telefone: '',
  }

  emailControl = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]);
  nomeControl = new FormControl('', [Validators.required]);
  sobrenomeControl = new FormControl('', [Validators.required]);
  cpfControl = new FormControl('', [Validators.required]);
  dtNascimentoControl = new FormControl(null, [Validators.required])
  telefoneControl = new FormControl('', [Validators.required])

  userForm: FormGroup = new FormGroup({
    _id: new FormControl(),
    nome: this.nomeControl,
    email: this.emailControl,
    sobrenome: this.sobrenomeControl,
    cpf: this.cpfControl,
    dtNascimento: this.dtNascimentoControl,
    telefone: this.telefoneControl,
  });

  config = new MatSnackBarConfig();

  constructor(
    private router: Router,
    public emitterComponentService: EmitterComponentService,
    private _snackBar: MatSnackBar,
    public requisicao: RequestService,
  ) { }

  ngOnInit(): void {
    var jsonUser = localStorage.getItem('user2');
    this.user = JSON.parse(jsonUser);
    if (this.user.dtNascimento) {
      var date = new Date(this.user.dtNascimento);
      this.user.dtNascimento = new Date(date);
    }
  }

  salvar() {
    if (this.userForm.value.dtNascimento instanceof Date) {
      var ano = this.userForm.value.dtNascimento.getFullYear();
      var mes = this.userForm.value.dtNascimento.getMonth() + 1;
      var dia = this.userForm.value.dtNascimento.getDate();
      this.user.dtNascimento = [ano, mes, dia].join('-');
    }
    var er = /[^a-z0-9]/gi;
    this.user.telefone = this.userForm.value.telefone.replace(er, "");
    this.requisicao.salvar('usuario', this.user).then((response: any) => {
      if (response.status === 0) {
        var jsonAux = JSON.stringify(this.user);
        localStorage.setItem('user2', jsonAux);
        this.config.duration = 5000;
        this.config.panelClass = ['danger'];
        this._snackBar.open(response.message, undefined, this.config);
        var jsonUser = localStorage.getItem('user2');
        this.user = JSON.parse(jsonUser);
        var date = new Date(this.user.dtNascimento);
        this.user.dtNascimento = new Date(date);
      } else {
        this.config.duration = 5000;
        this._snackBar.open('Falha ao salvar.', undefined, this.config);
      }
    });
  }

  clearStorage() {
    this.router.navigate(['/home']);
    this.emitterComponentService.emit(0);
  }
}
