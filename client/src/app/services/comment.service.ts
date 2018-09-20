import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Comment } from '../models/comment';
import { GLOBAL } from './global';

@Injectable()
export class CommentService {
	public url: string;

	constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
    }


    getCommentsCount(token, publication_id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			                           .set('Authorization', token);

		return this._http.get(this.url + 'count-publication/' + publication_id , { headers: headers });
	}

	getComments(token, publication_id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.get(this.url + 'comments-publication/' + publication_id, { headers: headers });
	}

	addComment(token, comment): Observable<any>{
		let params = JSON.stringify(comment);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);
		return this._http.post(this.url + 'comment', params, { headers: headers });
	}
    
}