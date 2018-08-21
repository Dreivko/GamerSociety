import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';
import { log } from 'util';


@Injectable()
export class UserService{
    public url:String;
    public identity;
    public token;

    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }c 

    register(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json'); 

        //console.log(params);
        //console.log(headers);
        //console.log(this.url+'register');
        
        return this._http.post(this.url+'register',params, {headers:headers});
    }

    signUp(user:User, gettoken = null): Observable<any>{
        if(gettoken != null){
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type','application/json');
    
        return this._http.post(this.url+'login', params, {headers: headers});
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        
        if(identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity
    }

    getToken(){
        let token = JSON.parse(localStorage.getItem('token'));

        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token
    }
}