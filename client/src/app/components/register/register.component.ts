import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';

@Component({
    selector: 'register',
    templateUrl: '../register/register.component.html'
})

export class RegisterComponent implements OnInit {
    public title: string;
    public user: User;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.title = 'Registrate'
        this.user = new User("",
        "",
        "",
        "",
        "",
        "",
        "ROL_USER",
        "");
    }

    ngOnInit() {
        console.log('Componente de registro cargado...')
    }
}