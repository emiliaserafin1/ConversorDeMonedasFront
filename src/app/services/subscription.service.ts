import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API } from '../constants/api';
import { ISubscription } from '../interfaces/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends ApiService {
  
  async getAll(): Promise<ISubscription[]> {
    const res = await fetch(API + 'Subscription', {
      headers: {
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
    const data = await res.json();
    return data;
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

  async getSubscriptionAmountOfConversions(id: number | string): Promise<number | undefined> {
    try {
      const res = await fetch(API + 'Subscription/' + id + '/AmountOfConversions', {
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