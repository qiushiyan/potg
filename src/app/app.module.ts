import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthModalComponent } from './user/auth-modal/auth-modal.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HomeComponent, AuthModalComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
