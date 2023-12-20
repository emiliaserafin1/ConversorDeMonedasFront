import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';
import { Conversion } from 'src/app/interfaces/conversion';
import { Currency } from 'src/app/interfaces/currency';
import { ISubscription } from 'src/app/interfaces/subscription';
import { UserSubscription } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ConversionService } from 'src/app/services/conversion.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  // Inyección de servicios
  router = inject(Router);
  auth = inject(AuthService);
  userService = inject(UserService);
  currencyService = inject(CurrencyService);
  subscriptionService = inject(SubscriptionService);
  conversionService = inject(ConversionService);


  // Señales y variables para el manejo del estado
  userId: number | null = 0;
  amountOfConversionsDone: number = 0;
  availableConversions: number | undefined = 0;
  remainingConversions: number = 0;
  favoriteCurrencies: WritableSignal<Currency[]> = signal([]);
  noFavoriteCurrencies: WritableSignal<Currency[]> = signal([]);
  conversions: WritableSignal<Conversion[]> = signal([]);
  subscriptions: WritableSignal<ISubscription[]> = signal([]);
  editingMode = signal(false);
  p1: number = 1;
  p2: number = 1;

  user: UserSubscription = {
    subscriptionId: 0
  }

  // Suscripción seleccionada
  subscription: ISubscription = {
    id: 0,
    name: "",
    amountOfConversions: 0,
    price: "",
  };

  async ngOnInit() {
    await this.fetchCurrencies();

    // Lista de monedas favoritas
    this.currencyService.getFavoriteCurrencies().then(res => {
      this.favoriteCurrencies.set(res);
      console.log(this.favoriteCurrencies());
    })

    // Lista de monedas no favoritas
    await this.getNonFavoriteCurrencies();

    // Lista de conversiones realizadas
    this.conversionService.getAllConversions().then(res => {
      this.conversions.set(res);
      console.log(this.conversions());
    })
    // Suscripciones
    this.subscriptionService.getAll().then(res => {
      this.subscriptions.set(res);
      console.log(this.subscriptions);
    })

    // Obtener el ID del usuario autenticado
    this.userId = this.auth.getUserId();

    // Si hay un usuario autenticado, obtener su información de suscripción
    if (this.userId !== null) {
      this.user = await this.userService.getUserById(this.userId)

      // Si el usuario tiene una suscripción, obtener la cantidad de conversiones disponibles
      if (this.user.subscriptionId !== undefined) {
        this.availableConversions = await this.subscriptionService.getSubscriptionAmountOfConversions(this.user.subscriptionId);
        const subscription = await this.subscriptionService.getSubscriptionById(this.user.subscriptionId);
        if (subscription !== undefined) {
          this.subscription = subscription;
        }
        await this.actualizarConversionesRestantes();
      }
    }
    this.subscription.name = this.subscription.name;
  }

  //#region Conversiones
  // Actualizar la cantidad de conversiones restantes
  async actualizarConversionesRestantes() {
    this.amountOfConversionsDone = await this.conversionService.getAmountOfConversions();

    if (this.availableConversions !== undefined) {
      this.remainingConversions = this.availableConversions - this.amountOfConversionsDone;
    }
    return 0;
  }
  //#endregion

  //#region Suscripciones
  activateEditMode() {
    this.editingMode.set(true);
  }

  // Método para confirmar la edición
  confirmEdit() {
    // Lógica para confirmar la edición, si es necesario
    this.editingMode.set(false); // Desactivar el modo de edición después de confirmar
  }

  // Método para cancelar la edición
  cancelEdit() {
    this.editingMode.set(false); // Desactivar el modo de edición
  }

  // Editar la suscripcion
  async editUserSubscription(subscriptionId: number) {
    // Obtener el ID del usuario autenticado
    const userId = this.auth.getUserId();

    // Obtener detalles de la suscripción seleccionada
    const subscription = await this.subscriptionService.getSubscriptionById(subscriptionId);
  

    // Manejar el caso de un usuario no autenticado
    if (!userId) return;

    Swal.fire({
      title: 'Has seleccionado la suscripción ' + subscription?.name,
      showCancelButton: true,
      confirmButtonColor: '#5E807F',
      cancelButtonColor: '#b7b7b7',
      cancelButtonText: 'Volver',
      confirmButtonText: 'Continuar',
    }).then((result) => {
      // Si el usuario confirma, realizar la edición de la suscripción
      if (result.isConfirmed) {
        this.userService.editUserSubscription(userId, subscriptionId).then((res) => {
          if (res) {
            // Redirigir al usuario a la página de inicio de sesión
            this.router.navigate(['/login']);
          } else {
            // Mostrar un mensaje de error en caso de fallo
            Swal.fire(
              'Ha ocurrido un error al seleccionar tu suscripción',
              'Intenta nuevamente.',
              'error'
            );
          }
        });
      }
    });
  }
  //#endregion

  //#region Monedas Favoritas

  // Eliminar una moneda de la lista de monedas favoritas
  async deleteFavoriteCurrency(currencyId: number) {
    const res = await this.currencyService.deleteFavoriteCurrency(currencyId);
    if (res) {
      await this.fetchCurrencies();
      generarMensajeExito('La moneda ha sido eliminada de tus favoritas');
    } else {
      generarMensajeError('Error eliminando moneda favorita');
    }
  }

  async getNonFavoriteCurrencies() {
    try {
      // Obtener todas las monedas
      const allCurrencies = await this.currencyService.getAllCurrencies();

      // Obtener las monedas favoritas
      const favoriteCurrencies = await this.currencyService.getFavoriteCurrencies();

      // Filtrar las monedas que no son favoritas
      this.noFavoriteCurrencies.set(allCurrencies.filter(currency =>
        !favoriteCurrencies.some(favCurrency => favCurrency.id === currency.id)
      ));

      console.log(this.noFavoriteCurrencies);
    } catch (error) {
      console.error('Error al obtener las monedas no favoritas:', error);
    }
  }

  async fetchCurrencies() {
    this.currencyService.getFavoriteCurrencies().then(res => { this.favoriteCurrencies.set(res) });
    await this.getNonFavoriteCurrencies()
  }
  //#endregion
}
