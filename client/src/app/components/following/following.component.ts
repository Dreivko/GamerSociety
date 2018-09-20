import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'following',
	templateUrl: './following.Component.html',
	providers: [UserService,FollowService]
})

export class FollowingComponent implements OnInit{
	public title:string;
	public url:string;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;	
	public total;
	public pages;
	public users:User[];
	public follows;
	public following;
	public followeds: string[];
	public status:string;
	public userPageId;



	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService
	){
		this.title = 'Siguiendo';
		this.url = GLOBAL.url;	
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();		
	}

	ngOnInit(){
		this.actualPage();		
	}

	actualPage(){
		this._route.params.subscribe(params => {
			let user_id = params['id'];
			this.userPageId = user_id;

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
			this.getFollows(user_id, page);
		});
	}

	getFollows(user_id, page){	
		this._followService.getFollowing(this.token, user_id, page).subscribe(
			response => {
				if(!response.follows){
					this.status = 'error';

				}else{					
					this.total = response.total;
					this.following = response.follows;
					this.pages = response.pages;
					this.follows = response.users_follow_me;

					this.followeds = new Array();
					

					for(var i=0; i< this.following.length;i++){
						this.followeds.push(this.following[i].followed._id);
					}


					//console.log(this.followeds);

					if(page > this.pages){
						this._router.navigate(['/gente',1]);
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

	public user: User;
	getUser(user_id, page){	
		this._userService.getUser(user_id).subscribe(
			response => {
				if(!response.users){
					this.user = response.user;
					//console.log(this.user);
					this.getFollows(user_id, page);
				}else{
						this._router.navigate(['/home']);
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


	public followUserOver;
	mouseEnter(user_id){
		this.followUserOver = user_id;
	}
	mouseLeave(user_id){
		this.followUserOver = 0;
	}

	followUser(followed){
		var follow = new Follow('', this.identity._id,followed);

		this._followService.addFollow(this.token, follow).subscribe(
			response => {
				if(!response.follow){
					this.status = 'error';
				}else{
					this.status = 'succes';
					//console.log("Ahora sigues a: "+followed);
					this.followeds.push(followed);				
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

	unfollowUser(followed){
		this._followService.deleteFollow(this.token, followed).subscribe(
			response =>{
				var search = this.followeds.indexOf(followed);
				if(search != -1){
					this.followeds.splice(search, 1);
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


}