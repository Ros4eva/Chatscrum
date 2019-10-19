import { Component, OnInit } from '@angular/core';
import { Scrumuser } from '../scrumuser';
import { ScrumdataService } from '../scrumdata.service';

@Component({
  selector: '.app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  constructor(private _scrumdataService: ScrumdataService) { }

  ngOnInit() {
  }

  userTypes = ['Regular User', 'Project Owner'];

  scrumUserModel = new Scrumuser ('','','','','');

  onSubmit() {
  	console.log(this.scrumUserModel)
  	this._scrumdataService.signup(this.scrumUserModel).subscribe(
  	data => console.log('success!', data),
  	error => console.log('Error!', error)
  	)
  }

}