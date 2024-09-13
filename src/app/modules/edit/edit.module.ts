import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing.module';
import { EditPagesComponent } from './pages/edit-pages/edit-pages.component';

@NgModule({
  declarations: [EditPagesComponent],
  imports: [CommonModule, EditRoutingModule],
  exports: [EditPagesComponent],
})
export class EditModule {}
