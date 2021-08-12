import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-message-dialog',
  templateUrl: './simple-message-dialog.component.html',
  styleUrls: ['./simple-message-dialog.component.css']
})

export class SimpleMessageDialogComponent implements OnInit {
  title: string;
  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string },
    private dialogRef: MatDialogRef<SimpleMessageDialogComponent>) {
    this.title = data.title;
    this.message = data.message;
    }

  ngOnInit(): void {
  }

}


