import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { usuarioSinLoguear } from './guards/usuario-sin-loguear.guard';
import { usuarioLogueadoGuard } from './guards/usuario-logueado.guard';

const routes: Routes = [
  {
    path:"login",
    canActivate: [usuarioSinLoguear],
    loadChildren: ()=> import('./public/pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path:"register",
    canActivate: [usuarioSinLoguear],
    loadChildren: ()=> import('./public/pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path:"subscription",
    loadChildren: ()=> import('./public/pages/subscription/subscription.module').then(m => m.SubscriptionModule)
  },
  {
    path:"conversor",
    canActivate: [usuarioLogueadoGuard],
    loadChildren: ()=> import('./authenticated-users/pages/conversor/conversor.module').then(m => m.ConversorModule)
  },
  {
    path:"perfil",
    canActivate: [usuarioLogueadoGuard],
    loadChildren: ()=> import('./authenticated-users/pages/user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule)
  },
  {
    path: "",
    redirectTo: 'conversor',
    pathMatch: "full"
  },
  {
    path:"**",
    loadChildren: ()=> import('./public/pages/error/error.module').then(m => m.ErrorModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
