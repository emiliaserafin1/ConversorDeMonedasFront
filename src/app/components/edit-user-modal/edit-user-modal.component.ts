import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generarMensajeError, generarMensajeExito } from 'src/app/helpers/messages';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent {
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


  onSubmit() {
    if (this.user.id)  this.editUser();
  }

  async editUser() {
    const userRole = await this.auth.getRole();
    if (userRole === "Admin") {
      const res = await this.userService.editUser(this.user);
      if (res) {
        generarMensajeExito('Usuario editado exitosamente');
        this.refresh.emit();
      } else {
        generarMensajeError('No se ha editado el usuario');
      } 
    } else {
      generarMensajeError('No tiene autorizacion para editar usuarios');
    }
  }
}
