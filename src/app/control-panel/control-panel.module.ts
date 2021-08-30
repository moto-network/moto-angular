import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlPanelRoutingModule } from "./control-panel-routing-module";
import { ControlPanelComponent } from './control-panel.component';

  
@NgModule({
  declarations: [ControlPanelComponent],
  imports: [
    CommonModule,
    ControlPanelRoutingModule
  ]
})
export class ControlPanelModule { }
