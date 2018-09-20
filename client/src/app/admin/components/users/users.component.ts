import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';


@Component({
	selector: 'admin-users',
	templateUrl: './users.component.html',
	providers: [UserService]
})

export class UsersComponent implements OnInit {
    public title:string;
	public url;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;	
	public total;
	public pages;
	public users:User[];
	public status:string;

    constructor(
        private _route: ActivatedRoute,
		private _router: Router,
        private _userService: UserService
    ){

    }

    ngOnInit() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;	
        
        if(!this.identity){
            localStorage.clear();
            this.identity = null;
            this._router.navigate(['/']); 
            window.location.reload();
        }else{
            if(this.identity.role != "ROLE_ADMIN"){
                this._router.navigate(['/']);
            }
            
        }
        this.actualPage();
		
	}

	actualPage(){
		this._route.params.subscribe(params =>{
			let page = +params['page'];
			this.page = page;

			if(!params['page']){
				page=1;
			}

			if(!page){
				page = 1;
			}else{
				this.next_page = page+1;
				this.prev_page = page-1;

				if(this.prev_page <= 0 ){
					this.prev_page = 1;
				}
			}

			//Obtener listado de usuarios
			this.getUsers(page);
		});
	}

	getUsers(page){	
		this._userService.getUsers(page).subscribe(
			response => {

				if(!response.users){
					this.status = 'error';

				}else{
					
					this.total = response.total;
					this.users = response.users;
					this.pages = response.pages;

					console.log(response);

					if(page > this.pages){
						this._router.navigate(['/admin-users',1]);
					}
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}

			}
		);

	}  

	blockUser(user: User){
        user.role = "ROLE_BLOCKED";
        console.log(user);
		this._userService.updateUser(user).subscribe(
            response =>{
				var search = this.users.indexOf(user);
				if(!search){
					this.users[search].role = "ROLE_BLOCKED";
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
        );        
	}

	unBlockUser(user){
		user.role = "ROLE_USER";
        console.log(user);
		this._userService.updateUser(user).subscribe(
            response =>{
				var search = this.users.indexOf(user);
				if(search != -1){
					this.users[search].role = "ROLE_USER";
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = 'error';
				}
			}
        );
	}

	public userOver;
	mouseEnter(user_id){
		this.userOver = user_id;
	}
	mouseLeave(user_id){
		this.userOver = 0;
	}


}