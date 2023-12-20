import { Component, EventEmitter, Input, NgModule, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterData, User, UserForCreation } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss']
})
export class NewUserModalComponent {
  userService = inject(UserService);
  auth = inject(AuthService);

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

  userForCreation: RegisterData = {
    Username: "",
    Password: "",
    Email: "",
    FirstName: "",
    LastName: "",
  }

 
  async addUser() {
    const res = await this.auth.register(this.userForCreation);
    if (res) {
      console.log(res);
      generarMensajeExito('Usuario creado exitosamente');
      this.refresh.emit();
    } else {
      generarMensajeError('No se ha creado el usuario');
    }
  }
}
