import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  // Esto es necesario para ngClass
import { AdminGestionQuizzComponent } from './admin-gestion-quizz.component';

@NgModule({
  declarations: [
    AdminGestionQuizzComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,  // Asegúrate de tenerlo en tu módulo base también
    AdminGestionQuizzComponent
  ],
  bootstrap: [AdminGestionQuizzComponent]
})
export class AppModule { }
