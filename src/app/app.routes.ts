import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: '', component: HomeComponent }
];
