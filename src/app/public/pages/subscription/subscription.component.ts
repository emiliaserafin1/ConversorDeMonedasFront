import { Component, OnInit, inject } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';
import { ISubscription } from 'src/app/interfaces/subscription';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  subscriptions: ISubscription[] = [];
  authService = inject(AuthService);
  subscriptionService = inject(SubscriptionService);
  userService = inject(UserService);
  router = inject(Router);

  subscription: ISubscription = {
    id: 0,
    name: "",
    amountOfConversions: 0,
    price: "",
  };

  ngOnInit(): void {
    this.subscriptionService.getAll().then((res) => {
      this.subscriptions = res;
      console.log(this.subscriptions);
    });
  }
  
  async editUserSubscription(subscriptionId: number) {
    const userId = this.authService.getUserId();
    const subscription = await this.subscriptionService.getSubscriptionById(subscriptionId);
    const subscriptionName = subscription?.name;
    if (!userId) return;
    Swal.fire({
      title:
        'Has seleccionado la suscripción ' +
        subscriptionName,
      showCancelButton: true,
      confirmButtonColor: '#5E807F',
      cancelButtonColor: '#b7b7b7',
      cancelButtonText: 'Volver',
      confirmButtonText: 'Continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.editUserSubscription(userId, subscriptionId).then((res) => {
          if (res) {
            this.router.navigate(['/login']);
          } else {
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
}