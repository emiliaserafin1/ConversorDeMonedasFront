import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API } from '../constants/api';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService{

  async getAll(): Promise<User[]> {
    const res = await fetch(API + 'User', {
      headers: {
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
    const data = await res.json();
    return data;
  }
  
  async editUserSubscription(userId: number, subscriptionId: number): Promise<boolean> {
    const res = await fetch(API + 'User/' + userId, {
      method: 'PATCH',
      headers: {
          Authorization: 'Bearer ' + this.auth.token(),
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionId), // Enviar subscriptionId directamente
    });
    return res.ok;
  }
  
  async editUser(user: User): Promise<boolean> {
    if (!user.Id) return false;
    const res = await fetch(API + 'User/' + user.Id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
      body: JSON.stringify(user),
    });
    return res.ok;
  }
}