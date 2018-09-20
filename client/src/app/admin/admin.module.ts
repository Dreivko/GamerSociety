//Modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from "angular2-moment";

//Rutas
import { AdminRoutingModule } from './admin-routing.module';

//Componentes
import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
    declarations: [
        MainComponent,
        DashboardComponent,
        UsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule, 
        MomentModule
    ],
    exports: [
        MainComponent,
        DashboardComponent,
        UsersComponent
    ],
    providers: []
})

export class AdminModule{}