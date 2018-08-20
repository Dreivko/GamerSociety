import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';


@Component({
    selector: 'login',
    templateUrl: '../login/login.component.html',
    providers: [UserService]
})

export class LoginComponent implements OnInit {
    public title: string;
    public user: User;
    public status: string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.title = 'Identificate';
        this.user = new User("", "", "", "", "", "", "ROL_USER", "","");
    }

    ngOnInit() {
        console.log('Componente de login cargado...')
    }

    onSubmit() {
        //loguear al usuario y conseguir sus datos
        this._userService.signUp(this.user).subscribe(
            response => {
                this.identity = response.user;
                
                console.log(this.identity);

                if (!this.identity || !this.identity._id) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    //PERSISTIR  DE USUARIO

                    //CONSEGUIR EL TOKEN
                    this.getToken();
                }

            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    getToken(){
        this._userService.signUp(this.user,'true').subscribe(
            response => {
                this.token = response.token;

                console.log(this.token);
                
                if (this.token.length <= 0) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    //PERSISTIR TOKEN DEL USUARIO

                    //CONSEGUIR LOS MARCADORES DEL USUARIO
                }

            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }
}