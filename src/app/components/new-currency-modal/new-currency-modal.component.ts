import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Currency} from 'src/app/interfaces/currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { AuthService } from 'src/app/services/auth.service';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';

@Component({
  selector: 'app-new-currency-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-currency-modal.component.html',
  styleUrls: ['./new-currency-modal.component.scss']
})
export class NewCurrencyModalComponent {
  @Output() cerrar = new EventEmitter();
  @Output() refresh = new EventEmitter()
  @Input() currency: Currency= {
    id: 0,
    name: '',
    symbol: '',
    value: 0,
  }

  private originalCurrency: Currency = {
    id: 0,
    name: '',
    symbol: '',
    value: 0,
  };

  currencyService = inject(CurrencyService);
  auth = inject(AuthService);

  async onSubmit() {
    this.currency.id ? this.editCurrency() : this.createCurrency();
  }


  async createCurrency() {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin") {
      const res = await this.currencyService.createCurrency(this.currency);
      if (res) {
        generarMensajeExito('La moneda ha sido creada con exito');
      } else {
        generarMensajeError('Error creando moneda');
      }
    } else {
      generarMensajeError('No tiene autorizacion para crear monedas');
    }
  }

  async editCurrency() {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin") {
      const res = await this.currencyService.editCurrency(this.currency);
      if (res) {
        generarMensajeExito('La moneda ha sido editada con exito');
      } else {
        generarMensajeError('No se ha editado la moneda');
      } 
    } else {
      generarMensajeError('No tiene autorizacion para editar monedas');
    }
  }

  async deleteCurrency() {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin") {
      const res = await this.currencyService.deleteCurrency(this.currency.id);
      if (res) {
        this.refresh.emit();
        this.fetchCurrencies()
        generarMensajeExito('La moneda ha sido eliminada');
      } else {
        generarMensajeError('Error eliminando moneda');
      }
    } else {
      generarMensajeError('No tiene autorizacion para eliminar mondas');
    }
  }

  async fetchCurrencies() {
    const res = await this.currencyService.getAllCurrencies();
    if (res) {
      this.refresh.emit();
    } 
  }
}
