import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { AutenticacaoGuard } from './guards/autenticacao/autenticacao.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MenuComponent } from './components/menu/menu.component';
import { ParkingComponent } from './components/parking/parking.component';
import { VeiclesComponent } from './components/veicles/veicles.component';
import { VeiclesParkingComponent } from './components/veicles-parking/veicles-parking.component';

const rotas: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  {
    path: 'home', component: MenuComponent, canActivate: [AutenticacaoGuard],
    children: [
      { path: 'profile', component: ProfileComponent, canActivate: [AutenticacaoGuard] },
      { path: 'parking', component: ParkingComponent, canActivate: [AutenticacaoGuard] },
      { path: 'veicles', component: VeiclesComponent, canActivate: [AutenticacaoGuard] },
      { path: 'veicles-parking', component: VeiclesParkingComponent, canActivate: [AutenticacaoGuard] },
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(rotas, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
