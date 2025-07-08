import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthSignInPageComponent } from './pages/auth-sign-in-page/auth-sign-in-page.component';

@NgModule({
  declarations: [AuthSignInPageComponent ],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AuthSignInModule {}
