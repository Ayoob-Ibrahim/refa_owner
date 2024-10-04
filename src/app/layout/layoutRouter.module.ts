import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../structure/sidebar/sidebar.component';
import { NavbarComponent } from '../structure/navbar/navbar.component';
import { FooterComponent } from '../structure/footer/footer.component';
import { routes } from '../layout/layout.routes';
import { LayoutComponent } from './layout.component';
import { ComponentModule } from '../modules/component.module';
import { AuthGuard } from '../auth-guard/authguard';



@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    LayoutComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), ComponentModule,],
  exports: [ComponentModule]
})
export class LayoutModule { }
