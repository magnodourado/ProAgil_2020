import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { ContatosComponent } from './contatos/contatos.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {path: 'eventos', component: EventosComponent },
  {path: 'palestrantes', component: PalestrantesComponent },
  {path: 'contatos', component: ContatosComponent },
  {path: 'dashboard', component: DashboardComponent },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Sempre por último para quando não der match com as anteriores.
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
