import { Component, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';
import { Conversion } from 'src/app/interfaces/conversion';
import { Currency } from 'src/app/interfaces/currency';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  // Inyección de servicios
  router = inject(Router);
  auth = inject(AuthService);
  userService = inject(UserService);
  currencyService = inject(CurrencyService);
  
  
  // Señales y variables para el manejo del estado
  userId: number | null = 0;
  conversions: WritableSignal<Conversion[]> = signal([]);
  currencies: WritableSignal<Currency[]> = signal([]);
  users: WritableSignal<User[]> = signal([]);

  p1: number = 1;
  p2: number = 1;

  async ngOnInit() {
    // Traer todos los usuarios
    this.userService.getAll().then(res => {
      this.users.set(res);
      console.log(this.users());
    })

    // Traer todos los usuarios
    this.currencyService.getAllCurrencies().then(res => {
      this.currencies.set(res);
      console.log(this.currencies());
    })
  }

  //#region Monedas
  // Método para editar una moneda
  async editCurrency(currency: Currency) {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin"){
      const res = await this.currencyService.editCurrency(currency);
      if (res) {
        await this.fetchCurrencies();
        generarMensajeExito('La moneda ha sido editada con exito');
      } else {
        generarMensajeError('Error editando moneda');
      }
    } else {
      generarMensajeError('No tiene autorizacion para editar mondas');
    }
  }

  // Método para eliminar una moneda
  async deleteCurrency(currencyId: number) {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin"){
      const res = await this.currencyService.deleteCurrency(currencyId);
      if (res) {
        await this.fetchCurrencies();
        generarMensajeExito('La moneda ha sido eliminada con exito');
      } else {
        generarMensajeError('Error eliminando moneda');
      }
    } else {
      generarMensajeError('No tiene autorizacion para eliminar mondas');
    }
  }
  
  // Método para actualizar la lista de monedas
  async fetchCurrencies() {
    this.currencyService.getAllCurrencies().then(res => { this.currencies.set(res) });
  }

  //#endregion

  //#region Usuarios

  // Método para editar un usuario
  async editUser(user: User) {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin"){
      const res = await this.userService.editUser(user);
      if (res) {
        await this.fetchUsers();
        generarMensajeExito('El usuario ha sido editado con exito');
      } else {
        generarMensajeError('Error editando usuario');
      }
    } else {
      generarMensajeError('No tiene autorizacion para editar usuarios');
    }
  }

  // Método para eliminar un usuario
  async deleteUser(userId: number) {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin"){
      const res = await this.userService.deleteUser(userId);
      if (res) {
        await this.fetchUsers();
        generarMensajeExito('El usuario ha sido eliminado con exito');
      } else {
        generarMensajeError('Error eliminando usuario');
      }
    } else {
      generarMensajeError('No tiene autorizacion para eliminar usuarios');
    }
  }

  // Método para actualizar la lista de usuarios
  async fetchUsers() {
    this.userService.getAll().then(res => { this.users.set(res) });
  }
}
