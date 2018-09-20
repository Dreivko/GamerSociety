import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';

const adminRoutes: Routes = [
{
    path: 'admin',
    component: MainComponent,
    children:[
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: DashboardComponent},
        {path: 'admin-users', component: UsersComponent},  
        {path: 'admin-users/:page', component: UsersComponent}          
    ]
}
];

@NgModule ({
    imports: [
        RouterModule.forChild(adminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule{}