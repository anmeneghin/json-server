import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TabelaSortableDirective } from './directives/tabela-sortable.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { UppercaseInputDirective } from './directives/uppercase-input.directive';


import { ArrayFiltroPipe } from './pipes/filtro.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { ModalComponent } from './modal/modal.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ArrayFiltroPipe,
    HighlightPipe,
    TabelaSortableDirective,
    DropdownDirective,
    UppercaseInputDirective,
    ModalComponent,
    AlertModalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



