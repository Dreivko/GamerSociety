import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { PublicationService } from '../../../services/publication.service';


@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.component.html',
	providers: [UserService, PublicationService]
})

export class DashboardComponent implements OnInit {
    public tittle: string;
	public status: string;
	public identity;
	public token;

    constructor(
        private _route: ActivatedRoute,
		private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ){

    }

    ngOnInit() {
        this.identity = this._userService.getIdentity();
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

	}

}