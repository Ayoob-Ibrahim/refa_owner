import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth-guard/authguard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'dashboard',
  },
  {
    path: 'login', component: LoginComponent,
  },

];
