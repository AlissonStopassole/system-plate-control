import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  animate = false;
  permissao = false;
  text = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.message === '1') this.permissao = true;
    else
      this.text = "Veiculo " + data.message + " sem permissão"
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.animate = true;
    }, 1000);
    setTimeout(() => {
      this.animate = false;
    }, 2000);
    setTimeout(() => {
      this.animate = true;
    }, 3000);
    setTimeout(() => {
      this.dialogRef.close();
    }, 4000);
  }
}
