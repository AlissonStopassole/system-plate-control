import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

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
  ) { }

  ngOnInit(): void {
  }

  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.senha).then((response) => {
        console.log(response.user.uid);
        localStorage.setItem('token', response.user.uid);
        this.router.navigate(['/home']);
        resolve();
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
