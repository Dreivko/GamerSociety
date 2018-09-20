import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { User } from '../../models/user';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';

@Component({
    selector: 'publications',
    templateUrl: './publications.component.html',
    providers: [UserService, PublicationService, CommentService]
})
export class PublicationsComponent implements OnInit {
    public title: string;
    public identity;
    public token;
    public url: string;
    public status: string;
    public page;
    public total;
    public pages;
    public itemsPerPage;
    public publications: Publication[];
    public comments: Comment[];
    public userComment: User;
    public comment: Comment;
    public showImage;
    public noMore = false;
    @Input() user: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _commentService: CommentService
    ) {
        this.title = 'Publicaciones';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
        this.comment = new Comment("","","",this.identity._id,"");
    }

    ngOnInit() {
        this.getPublications(this.user, this.page);
        if(this.publications){
            if(this.publications.length == this.total){
                this.noMore = true;
            }
        }
        
    }

    getPublications(user, page, adding = false) {
        this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
            response => {
                if (response.publications) {
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.items_per_page;
                    if (!adding) {
                        this.publications = response.publications;
                    } else {
                        var arrayA = this.publications;
                        var arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);
                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")},500);
                    }
                } else {
                    this.status = 'error';
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
    
    viewMore() {
        if (this.publications.length == this.total) {
            this.noMore = true;
        }
        else {
            this.page += 1;
            this.noMore = false;
        }
        this.getPublications(this.user, this.page, true);
    }
    refresh(event = null) {
        this.getPublications(this.user,1);
    }

    showThisImage(id) {
        this.showImage = id;
    }

    hideThisImage(id) {
        this.showImage = 0;
    }

    deletePublication(id) {
        this._publicationService.deletePublication(this.token, id).subscribe(
            response => {
                this.refresh();
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    addNewComment(form,publicationId,$event){
        this.comment.publication = publicationId;        
        this._commentService.addComment(this.token, this.comment).subscribe(
			response => {
				if(response.comment){    
                    //this.comments = response.comment.comments; 
                    this.getComment(publicationId);
                    this.status = 'success';
                    form.reset(); 		
				}else{
					this.status = 'error';
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

    getCommentsCount(publicationId): number{
        
        this._commentService.getCommentsCount(this.token,publicationId).subscribe(
			response => {
				if (response) {
					return response.total;
				}
			}, error => {
				console.log(<any>error);
			}
        );
        return 0;
    }

    getComment(publicationId){
        this._commentService.getComments(this.token,publicationId).subscribe(
            response => {
                if (response.comments) {
                    this.comments = response.comments;
                } else {
                    this.status = 'error';
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
    addFeedback(publication) {
        this._publicationService.addFeedback(this.token, publication._id).subscribe(
            response => {                
                var search = this.publications.indexOf(publication);
                this.publications[search].feedback.push(this.identity._id);
                if(this.publications[search].nofeedback.indexOf(this.identity._id) >= 0){
                    this.unNoFeedback(publication); 
                }
            },
            error => {
                console.log(<any>error);
                console.log("Make big data");
            }
        );
    }

    addNoFeedback(publication) {
        this._publicationService.addNoFeedback(this.token, publication._id).subscribe(
            response => {
                var search = this.publications.indexOf(publication);
                this.publications[search].nofeedback.push(this.identity._id);
                if(this.publications[search].feedback.indexOf(this.identity._id) >= 0){
                    this.unFeedback(publication); 
                }                
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    unFeedback(publication) {
        this._publicationService.unFeedback(this.token, publication._id).subscribe(
            response => {
                var search = this.publications.indexOf(publication);
                var userSearch = this.publications[search].feedback.indexOf(this.identity._id);
                this.publications[search].feedback.splice(userSearch, 1);
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    unNoFeedback(publication) {
        this._publicationService.unNoFeedback(this.token, publication._id).subscribe(
            response => {
                var search = this.publications.indexOf(publication);
                var userSearch = this.publications[search].nofeedback.indexOf(this.identity._id);
                this.publications[search].nofeedback.splice(userSearch, 1);
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    isFeedback(id) {
        this._publicationService.isFeedback(this.token, id).subscribe(
            response => {
                this.refresh();
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    isNoFeedback(id) {
        this._publicationService.isFeedback(this.token, id).subscribe(
            response => {
                this.refresh();
            },
            error => {
                console.log(<any>error);
            }
        );
    }

}