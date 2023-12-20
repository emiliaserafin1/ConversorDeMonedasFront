import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NewCurrencyModalComponent } from 'src/app/components/new-currency-modal/new-currency-modal.component';
import { NewUserModalComponent } from 'src/app/components/new-user-modal/new-user-modal.component';


@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    NgxPaginationModule,
    NewCurrencyModalComponent,
    NewUserModalComponent
  ]
})
export class AdminDashboardModule { }
