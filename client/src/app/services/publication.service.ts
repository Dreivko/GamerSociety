import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Publication } from '../models/publication';
import { GLOBAL } from './global';

@Injectable()
export class PublicationService {
	public url: string;

	constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	addPublication(token, publication): Observable<any> {
		let params = JSON.stringify(publication);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.post(this.url + 'publication', params, { headers: headers });
	}

	getPublications(token, page = 1): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);

		return this._http.get(this.url + 'publications/' + page, { headers: headers });
	}

	getPublication(token, id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.get(this.url + 'Publications/' + id, { headers: headers });
	}

	getPublicationsUser(token, user_id, page = 1): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);

		return this._http.get(this.url + 'publications-user/' + user_id + '/' + page, { headers: headers });
	}

	deletePublication(token, id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.delete(this.url + 'publication/' + id, { headers: headers });
	}

	addFeedback(token, id): Observable<any> {
		let params = JSON.stringify(this.getPublication(token, id));
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.put(this.url + 'feedback/' + id, params, { headers: headers })
	}

	addNoFeedback(token, id): Observable<any> {
		let params = JSON.stringify(this.getPublication(token, id));
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.put(this.url + 'nofeedback/' + id, params, { headers: headers })
	}

	getFeedbacks(id): Observable<any> {
		return this._http.get(this.url + 'feedbacks/' + id)
	}

	getNoFeedbacks(id): Observable<any> {
		return this._http.get(this.url + 'nofeedbacks/' + id)
	}

	unFeedback(token, id): Observable<any> {
		let params = JSON.stringify(this.getPublication(token, id));
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.put(this.url + 'unfeedback/' + id, params, { headers: headers })
	}
	unNoFeedback(token, id): Observable<any> {
		let params = JSON.stringify(this.getPublication(token, id));
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.put(this.url + 'unnofeedback/' + id, params, { headers: headers })
	}
	isFeedback(token, id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.get(this.url + 'isfeedback/' + id, { headers: headers })
	}
	isNoFeedback(token, id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization', token);
		return this._http.get(this.url + 'isnofeedback/' + id, { headers: headers })
	}
}