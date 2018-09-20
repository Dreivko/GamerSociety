import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	providers: [UserService]
})

export class LoginComponent implements OnInit {
	public tittle: string;
	public user: User;
	public status: string;
	public identity;
	public token;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	) {
		this.tittle = 'Identificate';
		this.user = new User("",
			"",
			"",
			"",
			"",
			"",
			"ROLE_USER",
			"");
	}

	ngOnInit() {

	}

	onSubmit(form) {
		//login de usuario
		this._userService.signup(this.user).subscribe(
			response => {
				this.identity = response.user;
				//console.log(this.identity);
				if (!this.identity || !this.identity._id) {
					this.status = 'error';
				} else {
					//console.log(response.user);
		//			this.status = 'success';

					//persistir datos de usuario en front
					localStorage.setItem('identity', JSON.stringify(this.identity));
					//Conseguir token
					this.gettoken();

					if(response.user.role == "ROLE_USER"){
						this._router.navigate(['/']);		
					}

					if(response.user.role == "ROLE_ADMIN"){
						this._router.navigate(['/admin']);
					}		

					if(response.user.role == "ROLE_BLOCKED"){
						alert("El usuario se encuentra bloqueado");
						localStorage.clear();
						this.identity = null;
						this._router.navigate(['/login']); 		
						this.token = null;	

					}				
					
					
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

	gettoken() {
		this._userService.signup(this.user, 'true').subscribe(
			response => {
				this.token = response.token;

				if (this.token.length <= 0) {
					this.status = 'error';
				} else {
	//				this.status = 'success';

					//persistir token del usuario en el front
					localStorage.setItem('token', this.token);

					this.getCounters();
					//	this._router.navigate(['/']);

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

	getCounters() {
		this._userService.getCounters().subscribe(
			response => {
				if (response) {
					//console.log(response);
					localStorage.setItem('stats', JSON.stringify(response));
					this.status = 'success'
					this._router.navigate(['/']);
				}
			}, error => {
				console.log(<any>error);
			}
		)
	}


}