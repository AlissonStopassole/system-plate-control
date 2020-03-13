import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/requisicao/request.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  vagas = 0;
  idEstacionamento;
  vagasOcupadas = 0;

  constructor(
    public requisicao: RequestService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.requisicao.buscar(`estacionamento-usuario/${Number(localStorage.getItem('user'))}`).then(response => {
      if (response.message.length) {
        this.vagas = response.message[0].qtdVagas;
        this.idEstacionamento = response.message[0]._id;
      }
    }).then(() => {
      this.requisicao.buscar(`vagas/${this.idEstacionamento}`).then(response => {
        if (response.message.length) {
          this.vagasOcupadas = response.message[0].qtdVagas;
        }
      });
    });
    this.openDialog();
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
