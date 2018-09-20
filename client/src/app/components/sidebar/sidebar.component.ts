import {Component, OnInit, EventEmitter, Input, Output} from "@angular/core";
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';
import {PublicationService} from "../../services/publication.service";
import { Router , ActivatedRoute , Params} from '@angular/router';
import { User } from "../../models/user";
import { UploadService } from '../../services/upload.service';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	providers:[UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit{
	public identity;
	public token;
	public stats;
	public url;
	public status;
	public publication: Publication;

	constructor(
		private _userService: UserService,
		private _publicationService: PublicationService,
		private _route: ActivatedRoute,
    private _router: Router,
    private _uploadService: UploadService
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		//this.stats = this._userService.getUpdatedStats(this.identity._id);
		this.stats = this._userService.getStats();
		//this.stats = this._userService.getCounters(this.identity._id);
		this.url = GLOBAL.url;
		this.publication = new Publication("","","","",this.identity._id,[""],[""])
	}

	ngOnInit(){
		console.log("sidebar.component ha sido cargado");
		this.getCounters(this.identity._id);
	}
	onSubmit(form, $event){
		this._publicationService.addPublication(this.token, this.publication).subscribe(
			response => {
				if(response.publication){
					//this.publication = response.publication;

					if(this.filesToUpload && this.filesToUpload.length){
						//Subir imagen
						this._uploadService.makeFileRequest(this.url+ 'upload-image-pub/' + response.publication._id,[],this.filesToUpload,this.token,'image')
						.then((result:any)=>{
						  this.publication.file = result.image;
						  this.status = 'success';
						  form.reset();
						  this._router.navigate(['/timeline']);
						  this.sended.emit({send:'true'});
						});
					}else{
						  this.status = 'success';
						  form.reset();
						  //this._router.navigate(['/timeline']);
						  this.sended.emit({send:'true'});
					}       				 
        			
				//location.reload();
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

 public filesToUpload: Array<File>
 fileChangeEvent(fileInput: any){
   this.filesToUpload = <Array<File>>fileInput.target.files;
 }



	//Output
	@Output() sended = new EventEmitter();
	sendPublication(event){
		console.log(event);
		this.sended.emit({send:'true'});
	}

	refresh(): void {

		this.getCounters(this.identity._id);
		window.location.reload();
	}

	getCounters(id) {
		this._userService.getCounters(id).subscribe(
			response => {
				if (response) {
					console.log(response);	
					localStorage.setItem('stats', JSON.stringify(response));
				}
			}, error => {
				console.log(<any>error);
				if(error.statusText == "Unauthorized"){
					alert(error.error.message);
					localStorage.clear();
					this.identity = null;
					this._router.navigate(['/']); 
				}
			}
		)
	}

}
