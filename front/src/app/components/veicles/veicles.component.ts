import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RequestService } from 'src/app/services/requisicao/request.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { enableProdMode } from '@angular/core';

enableProdMode();
@Component({
  selector: 'app-veicles',
  templateUrl: './veicles.component.html',
  styleUrls: ['./veicles.component.css']
})
export class VeiclesComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
  mascara = 'SSS-0000';

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

  config = new MatSnackBarConfig();
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel(true, []);
  displayedColumns: string[] = ['modelo', 'cor', 'ano', 'numeroPlaca', 'select'];

  pesquisar = true;
  editando = false;
  cadastrar = false;
  disableExcluir = true;

  constructor(
    private router: Router,
    public emitterComponentService: EmitterComponentService,
    public requisicao: RequestService,
    private _snackBar: MatSnackBar,
  ) {
    var anoAtual = new Date().getFullYear();
    for (let i = 0; i < 100; i++) {
      this.anos.push(anoAtual - i);
    }
  }

  ngOnDestroy(): void {
    this.selection = new SelectionModel(true, []);
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.buscarEstados();
    this.buscarVeiculos();
  }

  adicionar() {
    this.veicle = {
      modelo: '',
      ano: '',
      cor: '',
      cidade: '',
      estado: '',
      placaNova: false,
      numeroPlaca: '',
    }
    this.pesquisar = false;
    this.editando = false;
    this.cadastrar = true;
  }

  cancelar() {
    this.selection = new SelectionModel(true, []);
    this.dataSource = new MatTableDataSource([]);
    this.buscarVeiculos();
    this.pesquisar = true;
    this.editando = false;
    this.cadastrar = false;

  }

  buscarVeiculos() {
    this.requisicao.buscar(`veiculo-usuario/${Number(localStorage.getItem('user'))}`).then(response => {
      if (response.message.length) {
        this.dataSource = new MatTableDataSource(response.message);
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): any {
    this.disableExcluir = this.selection.selected.length > 0;

    if (this.selection.selected.length === 1) {
      this.editando = true;
    } else {
      this.editando = false;
    }

    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  salvar() {
    this.veicle.numeroPlaca = this.veicle.numeroPlaca.toUpperCase();
    this.veicle['idUsuario'] = Number(localStorage.getItem('user'));
    this.requisicao.salvar('veiculo', this.veicle).then(response => {
      if (response.message.length) {

        if (this.veicle['_id']) {
          this.selection = new SelectionModel(true, []);
          this.pesquisar = true;
          this.cadastrar = false;
          this.editando = false;
        }

        this.veicle = {
          modelo: '',
          ano: '',
          cor: '',
          cidade: '',
          estado: '',
          placaNova: false,
          numeroPlaca: '',
        }

        this.cidades = [];
        this.estados = [];

        this.buscarEstados();
        this.config.duration = 5000;
        this._snackBar.open(response.message, undefined, this.config);
      }
      else {
        this.config.duration = 5000;
        this._snackBar.open(response.message, undefined, this.config);
      }
    });
  }

  excluir() {
    this.selection.selected.forEach(veicle => {
      this.requisicao.salvar('veiculo/delete', veicle).then(response => {
        if (!response.message.length) {
          this.config.duration = 5000;
          this._snackBar.open(response.message, undefined, this.config);
        }
      }).then(() => {
        this.selection = new SelectionModel(true, []);
        this.dataSource = new MatTableDataSource([]);
        this.buscarVeiculos();
        this.config.duration = 5000;
        this._snackBar.open('Deletado com sucesso.', undefined, this.config);
      })
    });
  }

  editar() {
    this.pesquisar = false;
    this.editando = true;
    this.cadastrar = true;
    this.veicle = this.selection.selected[0];
    delete this.veicle['createdAt'];
    delete this.veicle['updatedAt'];
    this.buscarCidades();
  }

  buscarEstados() {
    this.requisicao.buscar('estado').then(response => {
      if (response.message.length) {
        this.estados = response.message;
        this.veicle.estado = this.estados[0]._id;
      }
    }).then(() => {
      this.buscarCidades();
    });
  }

  buscarCidades() {
    this.requisicao.buscar(`cidade/${this.veicle.estado}`).then(response => {
      if (response.message.length) {
        this.cidades = response.message;
        this.veicle.cidade = this.cidades[0]._id;
      }
    });
  }

  getMask(value) {
    this.mascara = '';
    if (value) {
      this.mascara = 'SSS0S00';
    } else {
      this.mascara = 'SSS-0000';
    }
    this.veicle.placaNova = value;
  }

  clearStorage() {
    this.router.navigate(['/home']);
    this.emitterComponentService.emit(0);
  }
}
