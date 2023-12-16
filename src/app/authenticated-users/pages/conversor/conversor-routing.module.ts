import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversorComponent } from './conversor.component';

const routes: Routes = [
  {
    path:"",
    component: ConversorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversorRoutingModule { }
