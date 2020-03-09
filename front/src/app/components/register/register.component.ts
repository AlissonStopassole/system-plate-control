import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AngularFireAuth } from 'angularfire2/auth';
import { RequestService } from 'src/app/services/requisicao/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user = {
    nome: '',
    sobrenome: '',
    email: '',
    senha: ''
  };
  confSenha = '';

  config = new MatSnackBarConfig();

  nomeControl = new FormControl('', [Validators.required]);
  sobrenomeControl = new FormControl('', [Validators.required]);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  senhaControl = new FormControl('', [Validators.required, Validators.min(6)])
  confSenhaControl = new FormControl('', [Validators.required, Validators.min(6)])

  userForm: FormGroup = new FormGroup({
    nome: this.nomeControl,
    sobrenome: this.sobrenomeControl,
    email: this.emailControl,
    senha: this.senhaControl,
    confSenha: this.confSenhaControl
  });

  constructor(
    private _snackBar: MatSnackBar,
    public _afAuth: AngularFireAuth,
    public requisicao: RequestService,
    private router: Router,
  ) { }


  ngOnInit(): void {
  }

  salvar() {
    if (this.userForm.value.senha === this.userForm.value.confSenha) {
      this.cadastro(this.userForm.value.email, this.userForm.value.senha);
      this.router.navigate(['/login']);
    } else {
      this.config.duration = 5000;
      this.config.panelClass = ['danger'];
      this._snackBar.open('As senhas devem ser iguais.', undefined, this.config);
    }
  }

  cadastro(email: string, senha: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afAuth.auth.createUserWithEmailAndPassword(email, senha).then(() => {
        this.requisicao.salvar('usuario',
          {
            email: this.userForm.value.email,
            nome: this.userForm.value.nome,
            sobrenome: this.userForm.value.sobrenome
          }).then(() => {
            this._snackBar.open('Salvo com sucesso.', undefined, this.config);
            this.user = {
              nome: '',
              sobrenome: '',
              email: '',
              senha: ''
            };
            this.confSenha = '';
            resolve();
          });

      })
        .catch((error) => {
          // Valiar erros firebase
          console.log(error);
        });
    })
      .catch((error) => {
        // Valiar erros firebase
        console.log(error);
      });
  }

}
