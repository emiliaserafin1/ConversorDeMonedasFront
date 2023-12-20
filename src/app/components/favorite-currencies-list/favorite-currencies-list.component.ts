import { Component, EventEmitter, Input, Output, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from 'src/app/services/currency.service';
import { Currency } from 'src/app/interfaces/currency';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';

@Component({
  selector: 'app-favorite-currencies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-currencies-list.component.html',
  styleUrls: ['./favorite-currencies-list.component.scss']
})
export class FavoriteCurrenciesListComponent {
  currencyService = inject(CurrencyService);
  @Output() cerrar = new EventEmitter();
  @Output() refresh = new EventEmitter()
  @Input() noFavoriteCurrencies: Currency[] = [];


  // Agregar una moneda a la lista de monedas favoritas
  async addFavoriteCurrency(currencyId: number) {
    const res = await this.currencyService.addFavoriteCurrency(currencyId);
    if (res) {
      generarMensajeExito('La moneda ha sido agregada a tus favoritas');
      this.refresh.emit();
    } else {
      generarMensajeError('Error agregando moneda favorita');
    }
  }
}
