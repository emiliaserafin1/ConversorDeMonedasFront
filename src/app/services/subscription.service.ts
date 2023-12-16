import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API } from '../constants/api';
import { ISubscription } from '../interfaces/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends ApiService {
  
  async getAll(): Promise<ISubscription[]> {
    const res = await this.getAuth('Subscription');
    const resJson = await res.json();
    return resJson;
  }


  async getSubscriptionById(id: number | string): Promise<ISubscription | undefined> {
    try {
      const res = await fetch(API + 'Subscription/' + id, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + this.auth.token(),
        },
      });
      if (!res.ok) {
        throw new Error('Error fetching subscription');
      }
      return await res.json();
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}