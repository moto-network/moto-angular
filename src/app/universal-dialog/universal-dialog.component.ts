import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-universal-dialog',
  templateUrl: './universal-dialog.component.html',
  styleUrls: ['./universal-dialog.component.css']
})

export class UniversalDialogComponent implements OnInit {
  title: string;
  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string },
    private dialogRef: MatDialogRef<UniversalDialogComponent>) {
    this.title = data.title;
    this.message = data.message;
    }

  ngOnInit(): void {
  }

}


