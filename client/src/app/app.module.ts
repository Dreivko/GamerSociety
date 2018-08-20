import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@Angular/forms';
import { NgModule } from '@angular/core';
//import { HttpModule } from '@angular/http'
import { HttpClientModule} from '@angular/common/http'

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { routing, appRoutingProviders } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
