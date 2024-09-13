import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /* aca van los componentes para renderizar 
  que no destruyen el resto de los componentes
  TRACKS HISTORY FAVORITES
  */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
