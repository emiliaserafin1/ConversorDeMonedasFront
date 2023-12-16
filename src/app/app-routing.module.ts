import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"login",
    loadChildren: ()=> import('./public/pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path:"register",
    loadChildren: ()=> import('./public/pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path:"subscription",
    loadChildren: ()=> import('./authenticated-users/pages/subscription/subscription.module').then(m => m.SubscriptionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
