import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/sniper', pathMatch: "full" },
  {
    path: 'dashboard',
    redirectTo: '/sniper',
    // component: DashboardComponent
  },
  { path: 'sniper', component: DashboardComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
