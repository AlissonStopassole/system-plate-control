import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { AutenticacaoGuard } from './guards/autenticacao/autenticacao.guard';
import { LoaderService } from './services/loader/loader-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private url = 'http://localhost:3000';
  private socket;
  public carregando: any;

  constructor(
    private dialog: MatDialog,
    private autentication: AutenticacaoGuard,
    private loaderService: LoaderService,
  ) {
    this.loaderService.issue.subscribe(resposta => this.carregando = resposta);

    this.socket = io(this.url)
    this.socket.on('new-message', message => {
      autentication.canActivate().then(response => {
        if (message && response) {
          this.openDialog(message);
        }
      });
    });
  }

  openDialog(message: String): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      height: '500px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
