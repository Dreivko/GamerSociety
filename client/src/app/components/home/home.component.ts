import { Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'home',
	templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit{
	public title:string;
	public identity;

	constructor(
		private _userService: UserService
	){
		this.title = 'Bienvenido';
		this.identity = this._userService.getIdentity();
	}

	ngOnInit(){

	}
}