import { Component, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Conversion, ConversionResult } from 'src/app/interfaces/conversion';
import { Currency } from 'src/app/interfaces/currency';
import { AuthService } from 'src/app/services/auth.service';
import { ConversionService } from 'src/app/services/conversion.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserSubscription } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { generarMensajeError } from 'src/app/helpers/messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.scss']
})
export class ConversorComponent {
  // Inyección de servicios
  conversionService = inject(ConversionService)
  currencyService = inject(CurrencyService)
  router = inject(Router);
  auth = inject(AuthService);
  subscriptionService = inject(SubscriptionService);
  snackBar = inject(MatSnackBar);
  userService = inject(UserService);

  // Señales y variables para el manejo del estado
  errorConverting: WritableSignal<boolean> = signal(false)
  cargando: WritableSignal<boolean> = signal(false);
  currencies: Currency[] = [];
  favoriteCurrenciesSet: Set<number> = new Set();
  userId: number | null = 0;
  amountOfConversionsDone: number = 0;
  availableConversions: number | undefined = 0;
  remainingConversions: number = 0;


  conversionResult: number = 0;
  
  user: User= {
    id: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    subscriptionId: 0,
  }

  conversion: Conversion = {
    userId: 0,
    sourceCurrencyId: 0,
    targetCurrencyId: 0,
    originalAmount: 0,
    sourceCurrencyName: '',
    targetCurrencyName: '',
    convertedAmount: 0,
    date: new Date()
  }   

  // Método que se ejecuta al iniciar el componente
  async ngOnInit() {
    try {
      // Obtener todas las monedas
      this.currencies = await this.currencyService.getAllCurrencies();
      const favoriteCurrencies = await this.currencyService.getFavoriteCurrencies();
      // Crea un nuevo conjunto con las monedas favoritas para facilitar la búsqueda
      this.favoriteCurrenciesSet = new Set(favoriteCurrencies.map(currency => currency.id));

      // Ordena la lista de todas las monedas de tal manera que las monedas favoritas aparezcan primero
      this.currencies.sort((a, b) => {
        const aIsFavorite = this.favoriteCurrenciesSet.has(a.id);
        const bIsFavorite = this.favoriteCurrenciesSet.has(b.id);

        if (aIsFavorite && !bIsFavorite) {
          return -1;
        } else if (!aIsFavorite && bIsFavorite) {
          return 1;
        } else {
          return 0;
        }
      });

      // Obtener el ID del usuario autenticado
      this.userId = this.auth.getUserId();
      console.log('ID USUARIO'+this.userId);
      // Si hay un usuario autenticado, obtener su información de suscripción
      if (this.userId !== null) {
        this.user = await this.userService.getUserById(this.userId)
        
        // Si el usuario tiene una suscripción, obtener la cantidad de conversiones disponibles
        console.log('USUARIO SUSCRIPCION ID '+this.user.subscriptionId);
        
        if (this.user.subscriptionId !== undefined) {
          this.availableConversions = await this.subscriptionService.getSubscriptionAmountOfConversions(this.user.subscriptionId);
          console.log('CONVERSIONES DISPONIBLES '+this.availableConversions);
          await this.actualizarConversionesRestantes();
          console.log('CONVERSIONES RESTANTES '+this.remainingConversions);
        }
      }
      // Asigno las monedas por defecto para que aparezcan en el select
      this.conversion.sourceCurrencyId = this.currencies[0].id;
      this.conversion.targetCurrencyId = this.currencies[1].id;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para realizar la conversión
  async convert() {
    this.errorConverting.set(false);

    // Obtener el ID del usuario autenticado
    this.userId = this.auth.getUserId();

    // Obtener información del usuario y su suscripción
    if (this.userId === null) return console.log('Id de usuario nulo');
    this.user = await this.userService.getUserById(this.userId)
    if (this.user.subscriptionId === undefined) return console.log('Id de suscripción nulo');
    this.availableConversions = await this.subscriptionService.getSubscriptionAmountOfConversions(this.user.subscriptionId);
    this.conversion.userId = this.userId;

    // Validaciones
    if (!this.conversion) return console.log(this.conversion)
    if (isNaN(this.conversion.originalAmount)) {
      return generarMensajeError('El monto debe ser un número');
    }
    if (this.conversion.originalAmount <= 0) {
      return generarMensajeError('El monto a convertir no puede ser negativo o nulo (cero)');
    }
    if (this.conversion.sourceCurrencyId == this.conversion.targetCurrencyId) {
      return generarMensajeError('Las monedas deben ser diferentes');
    }
    if (this.remainingConversions <= 0) {
      Swal.fire({
        title: "No tienes conversiones disponibles",
        icon: "error",
        footer: '<a href="/subscription">Ir a suscripción</a>'
    });
    }
    // Realizar la conversión
    const res = await this.conversionService.convert(this.conversion);
    console.log(res);

    // Manejar el resultado de la conversión
    if (res) {
      this.conversionResult = res;  
      await this.actualizarConversionesRestantes();  // Actualizar conversionesRestantes
  
      // Si no quedan conversiones, redirigir al usuario
      if (this.remainingConversions === 0) {
        this.snackBar.open('Debes cambiar tu suscripción', 'Cerrar', {
          duration: 5000,
        });
        return this.router.navigate(['/subscription']);
      }
    } else {
      this.errorConverting.set(true);
    }
  }

  // Actualizar la cantidad de conversiones restantes
  async actualizarConversionesRestantes() {
    this.amountOfConversionsDone = await this.conversionService.getAmountOfConversions();

    if (this.availableConversions  !== undefined) {
      this.remainingConversions = this.availableConversions - this.amountOfConversionsDone;
    } 
    return 0;
  }
}
