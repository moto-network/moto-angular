import { Component, ComponentFactoryResolver, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-universal-dialog',
  templateUrl: './universal-dialog.component.html',
  styleUrls: ['./universal-dialog.component.css']
})
export class UniversalDialogComponent implements OnInit {
  constructor(private componentFactoryResolver: ComponentFactoryResolver
    , private matDialogRef: MatDialogRef<UniversalDialogComponent>) {

  }

  ngOnInit(): void {
    
  }

}
