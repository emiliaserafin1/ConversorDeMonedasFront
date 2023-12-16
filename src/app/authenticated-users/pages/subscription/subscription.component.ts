import { Component, OnInit, inject } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service'; // Asegúrate de importar UserService
import { ISubscription } from 'src/app/interfaces/subscription';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/services/auth.service';

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
  

  ngOnInit(): void {
    this.subscriptionService.getAll().then((res) => {
      this.subscriptions = res;
      console.log(this.subscriptions);
    });
  }
  
  async editUserSubscription(subscriptionId: number) {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.userService.editUserSubscription(userId, subscriptionId).then((res) => {
      if (res) {
        generarMensajeExito('Subscription changed');
      } else {
        generarMensajeError('Error changing subscription');
      }
    });
  }
}