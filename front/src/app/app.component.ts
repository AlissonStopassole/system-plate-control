import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { AutenticacaoGuard } from './guards/autenticacao/autenticacao.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private url = 'http://localhost:3000';
  private socket;

  constructor(
    private dialog: MatDialog,
    private autentication: AutenticacaoGuard

  ) {
    this.socket = io(this.url)
    this.socket.on('new-message', message => {
      autentication.canActivate().then(response => {
        if (message && response) {
          this.openDialog();
        }
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
