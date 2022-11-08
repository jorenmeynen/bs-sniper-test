import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BbscRankingColorsComponent } from './containers/bbsc-ranking-colors/bbsc-ranking-colors.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { HsvComponent } from './containers/hsv/hsv.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/sniper', pathMatch: "full" },
  { path: 'dashboard', redirectTo: '/sniper' },
  { path: 'sniper', component: DashboardComponent },
  { path: 'bbsc', redirectTo: '/ranking-color' },
  { path: 'ranking-color', component: BbscRankingColorsComponent },
  { path: 'hsv', component: HsvComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
