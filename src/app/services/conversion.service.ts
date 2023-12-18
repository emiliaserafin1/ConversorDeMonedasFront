import { Injectable, inject } from '@angular/core';
import { Conversion } from '../interfaces/conversion';
import { API } from '../constants/api';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  auth = inject(AuthService);

  async convert(conversion: Conversion) {
    const res = await fetch(API + 'Conversion/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token(),
      },
      body: JSON.stringify(conversion),
    });
    console.log('Convirtendo', res);
    if (res) return await res.json();
  }

  async getAllConversions() {
    const res = await fetch(API + 'Conversion', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token(),
      },
    });
    const data = await res.json();
    return data;
  }

  async getAmountOfConversions(){
    const res = await fetch(API + 'Conversion/conversionsAmount', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token(),
      },
    });
    const data = await res.json();
    return data;
  }
}
