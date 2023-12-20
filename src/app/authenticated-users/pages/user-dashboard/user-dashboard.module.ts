import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { FavoriteCurrenciesListComponent } from 'src/app/components/favorite-currencies-list/favorite-currencies-list.component';


@NgModule({
  declarations: [
    UserDashboardComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    NgxPaginationModule,
    FormsModule,
    FavoriteCurrenciesListComponent
  ]
})
export class UserDashboardModule { }
