import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/services/requisicao/request.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    senha: ''
  };

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  senhaControl = new FormControl('', [Validators.required, Validators.min(6)])

  loginForm: FormGroup = new FormGroup({
    email: this.emailControl,
    senha: this.senhaControl,
  });

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    public _afAuth: AngularFireAuth,
    public requisicao: RequestService,
  ) { }

  ngOnInit(): void {
  }

  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.senha).then((response) => {
        this._afAuth.auth.currentUser.getIdToken().then((token) => {
          localStorage.setItem('token', token);
          this.requisicao.salvar('usuario/email', { email: this.loginForm.value.email }).then(retorno => {
            localStorage.setItem('user', retorno.message[0]._id);
            var jsonAux = JSON.stringify(retorno.message[0]);
            localStorage.setItem('user2', jsonAux);

            this.router.navigate(['/home']);
            resolve();
          });
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
