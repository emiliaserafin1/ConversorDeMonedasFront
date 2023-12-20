import { Component, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';
import { Conversion } from 'src/app/interfaces/conversion';
import { Currency } from 'src/app/interfaces/currency';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

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
    })

    // Traer todos las monedas
    this.currencyService.getAllCurrencies().then(res => {
      this.currencies.set(res);
    })
  }

  //#region Monedas

  // Método para eliminar una moneda
  async deleteCurrency(currencyId: number) {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin"){
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar esta moneda?',
        showCancelButton: true,
        confirmButtonColor: '#5E807F',
        cancelButtonColor: '#b7b7b7',
        cancelButtonText: 'Volver',
        confirmButtonText: 'Eliminar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.currencyService.deleteCurrency(currencyId).then((res) => {
            if (res) {
              this.fetchCurrencies();
              generarMensajeExito('La moneda ha sido eliminada con exito');
            } else {
              generarMensajeError('Error eliminando moneda');
            }
          });
        }
      });
    }
  }
  
  // Método para actualizar la lista de monedas
  async fetchCurrencies() {
    this.currencyService.getAllCurrencies().then(res => { this.currencies.set(res) });
  }

  //#endregion

  //#region Usuarios

  // Método para eliminar un usuario
  async deleteUser(userId: number) {
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar este usuario?',
      showCancelButton: true,
      confirmButtonColor: '#5E807F',
      cancelButtonColor: '#b7b7b7',
      cancelButtonText: 'Volver',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).then((res) => {
          if (res) {
            this.fetchUsers();
            generarMensajeExito('El usuario ha sido eliminado con exito');
          } else {
            generarMensajeError('Error eliminando usuario');
          }
        });
      }
    });
  }

  // Método para actualizar la lista de usuarios
  async fetchUsers() {
    this.userService.getAll().then(res => { this.users.set(res) });
  }
}
