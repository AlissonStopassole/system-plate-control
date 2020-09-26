import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';
import { RequestService } from 'src/app/services/requisicao/request.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { enableProdMode } from '@angular/core';

enableProdMode();
@Component({
  selector: 'app-veicles-parking',
  templateUrl: './veicles-parking.component.html',
  styleUrls: ['./veicles-parking.component.css']
})
export class VeiclesParkingComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  config = new MatSnackBarConfig();
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel(true, []);
  displayedColumns: string[] = ['modelo', 'cor', 'ano', 'numeroPlaca'];

  constructor(
    private router: Router,
    public emitterComponentService: EmitterComponentService,
    public requisicao: RequestService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnDestroy(): void {
    this.selection = new SelectionModel(true, []);
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.buscarVeiculosParking();
  }

  buscarVeiculosParking() {
    this.requisicao.buscar(`get-veicle/1`).then(response => {
      if (response.status === 0) {
        this.dataSource = new MatTableDataSource(response.message);

        this.dataSource.sort = this.sort;
      } else {
        this.config.duration = 5000;
        this._snackBar.open('Falha ao buscar.', undefined, this.config);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearStorage() {
    this.router.navigate(['/home']);
    this.emitterComponentService.emit(0);
  }
}
