import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllModule } from '../all/all.module';
import { NewModule } from '../new/new.module';
import { EditModule } from "../edit/edit.module";

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    AllModule,
    NewModule,
    EditModule
],
})
export class HomeModule {}
