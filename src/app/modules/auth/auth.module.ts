import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from './pages/sign-up/signup-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';
import { ModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PrimaryBtnComponent,
    ModalComponent,
  ]
})
export class AuthModule { }
