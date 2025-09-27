import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './components/sideBar/side-bar/side-bar.component';
import { PopMessageComponent } from './components/pop-message/pop-message.component';

@NgModule({
  declarations: [ PopMessageComponent],
  imports: [CommonModule],
  exports: [ PopMessageComponent],
})
export class SharedModule {}
