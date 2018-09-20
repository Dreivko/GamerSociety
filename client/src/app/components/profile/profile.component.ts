import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';



@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    providers: [UserService, FollowService]
})

export class ProfileComponent implements OnInit {
    public title: string;
    public user: User;
    public status: string;
    public identity;
    public token;
    public stats;
    public url;
    public followed;
    public following;
    public showImage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Perfil';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.followed = false;
        this.following = false;
        console.log(this.identity);
    }

    ngOnInit() {
        console.log("profile.component cargado correcatamente");
        this.loadPage();
    }

    loadPage() {
        this._route.params.subscribe(params => {
            let id = params['id'];
            this.getUser(id);
            this.getCounters(id);
        });
    }

    getUser(id) {
        this.followed = false;
        this.following = false;
        this._userService.getUser(id).subscribe(
            response => {
                if (response.user) {
                    console.log(response);
                    this.user = response.user;

                    response.following.forEach(element => {
                        if (element.user == this.user._id) {
                            this.following = true;
                        }
                    });

                    response.followed.forEach(element => {
                        if (element.followed == this.user._id) {
                            this.followed = true;
                        }
                    });

                } else {
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
                this._router.navigate(['/perfil', this.identity._id]);
            }
        );
    }

    getCounters(id) {
        this._userService.getCounters(id).subscribe(
            response => {
                console.log(response);
                this.stats = response;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    followUser(following) {
        var follow = new Follow('', this.identity._id, following);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                this.followed = true;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    unfollowUser(following) {
        this._followService.deleteFollow(this.token, following).subscribe(
            response => {
                this.followed = false;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    public followUserOver;
    mouseEnter(user_id) {
        this.followUserOver = user_id;
    }
    mouseLeave() {
        this.followUserOver = 0;
    }
}
