import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConversorRoutingModule } from './conversor-routing.module';
import { ConversorComponent } from './conversor.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConversorComponent
  ],
  imports: [
    CommonModule,
    ConversorRoutingModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class ConversorModule { }
