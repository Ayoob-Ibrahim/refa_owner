import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes, {
    useHash: true,
  }),],
  exports: [RouterModule],
})
export class ApprouteModule { }
