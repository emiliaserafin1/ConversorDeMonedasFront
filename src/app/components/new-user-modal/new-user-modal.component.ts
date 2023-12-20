import { Component, EventEmitter, Input, NgModule, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-new-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss']
})
export class NewUserModalComponent {
  userService = inject(UserService);

  @Output() cerrar = new EventEmitter();
  @Output() refresh = new EventEmitter()
  @Input() user: User = {
    id: 0,
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    subscriptionId: 0
  }

  async onSubmit() {
    this.user.id ? this.editUser() : this.createUser();
  }

  async createUser() {
    const res = await this.userService.createUser(this.user);
    if (res) {
      generarMensajeExito('Usuario creado exitosamente');
      this.refresh.emit();
    } else {
      generarMensajeError('No se ha creado el usuario');
    }
  }

  async editUser() {
    const res = await this.userService.editUser(this.user);
    if (res) {
      generarMensajeExito('Usuario editado exitosamente');
      this.refresh.emit();
    } else {
      generarMensajeError('No se ha editado el usuario');
    }
  }
}
