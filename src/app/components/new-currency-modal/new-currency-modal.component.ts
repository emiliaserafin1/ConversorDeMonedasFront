import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-currency-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-currency-modal.component.html',
  styleUrls: ['./new-currency-modal.component.scss']
})
export class NewCurrencyModalComponent {

}
