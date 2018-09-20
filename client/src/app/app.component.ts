import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from './services/user.service';
import {GLOBAL} from './services/global';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title:string;
  public identity;
  public url:string;
  public isAdmin;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  	private _userService:UserService
  ){
  		this.title = 'NAGIT';
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    let obs = new Observable(observer => {
      let intervalo = setInterval( ()=>{
        
        if(this.identity){
          if(this.identity.role == "ROLE_ADMIN"){
            this.isAdmin = true;
          }else{
            this.isAdmin = false;
          }
          clearInterval(intervalo);
          observer.complete();
        }
      },1);

    });

    obs.subscribe(admin =>{
      //console.log("");
    });
    
    
    this.url = GLOBAL.url;
  	//console.log(this.identity);
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logout(){
   localStorage.clear();
   this.identity = null;
   this._router.navigate(['/']); 
   this.isAdmin = false;
   window.location.reload();
  }

}
