import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { MomentModule } from 'angular2-moment';

//Modulo custom
import { MessagesModule } from './messages/messages.module';
import { AdminModule } from './admin/admin.module';


// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FollowedComponent } from './components/followed/followed.component';
import { FollowingComponent } from './components/following/following.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicationsComponent } from './components/publications/publications.component';

// Servicios
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UsersComponent,
    UserEditComponent,
    SidebarComponent,
    FollowedComponent,
    FollowingComponent,
    TimelineComponent,
    ProfileComponent,
    PublicationsComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule,
    MessagesModule,
    AdminModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
