import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { AllModule } from '../all/all.module';
import { EditModule } from '../edit/edit.module';
import { NewModule } from '../new/new.module';

@NgModule({
  declarations: [WelcomePageComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    AllModule,
    EditModule,
    NewModule,
  ],
  exports: [WelcomePageComponent],
})
export class WelcomeModule {}
