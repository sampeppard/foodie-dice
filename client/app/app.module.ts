import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ListsComponent } from './components/lists/lists.component';
import { LoginComponent } from './components/login/login.component';

import { LoginService } from './services/login.service';
import { ListService } from './services/list.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ListsComponent,
    LoginComponent
  ],
  providers: [
    LoginService,
    ListService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
