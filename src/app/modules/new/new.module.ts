import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPagesComponent } from './pages/new-pages/new-pages.component';
import { NewRoutingModule } from './new-routing.module';

@NgModule({
  declarations: [NewPagesComponent],
  imports: [CommonModule, NewRoutingModule],
  exports: [NewPagesComponent],
})
export class NewModule {}
