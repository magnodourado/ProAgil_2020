import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, ModalModule, TooltipModule, BsDatepickerModule, TabsModule } from 'ngx-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';

import { EventoService } from './_services/evento.service';

import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { NavComponent } from './nav/nav.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContatosComponent } from './contatos/contatos.component';
import { TitleComponent } from './_shared/title/title.component';


import { DateTimeFormatPipePipe } from './_helps/DateTimeFormatPipe.pipe';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { EventoEditComponent } from './eventos/eventoEdit/eventoEdit.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
   declarations: [
      AppComponent,
      EventosComponent,
      EventoEditComponent,
      NavComponent,
      PalestrantesComponent,
      DashboardComponent,
      ContatosComponent,
      TitleComponent,
      UserComponent,
      LoginComponent,
      RegistrationComponent,
      DateTimeFormatPipePipe
   ],
   imports: [
      CommonModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      TabsModule.forRoot(),
      NgxMaskModule.forRoot(),
      NgxCurrencyModule,
      BsDropdownModule.forRoot(),
      TooltipModule.forRoot(),
      ModalModule.forRoot(),
      BsDatepickerModule.forRoot(),
      ReactiveFormsModule,
      ToastrModule.forRoot({
         timeOut: 2000,
         positionClass: 'toast-bottom-right',
         preventDuplicates: true
      })
   ],
   providers: [
      EventoService,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor,
         multi: true
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
