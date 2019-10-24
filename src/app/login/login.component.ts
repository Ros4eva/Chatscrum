import { Component, OnInit } from '@angular/core';
import { ScrumdataService } from '../scrumdata.service'
import { Router } from '@angular/router';
import { Http, Response } from '@angular/Http';


@Component({
  selector: '.app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  scrumUserLoginData = {};

  constructor(private _scrumdataservice: ScrumdataService, private _router: Router) { }

  ngOnInit() {
  }

  feedback = ""

  rose(message, data) {
    var x = document.getElementById("alert");
    document.getElementById('alert').innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  onLoginSubmit () {
  	this._scrumdataservice.login (this.scrumUserLoginData).subscribe(
  	data => {
  		console.log('success', data)
  		localStorage.setItem('token', data.token)
  		this._router.navigate(['/scrumboard'])
  	},
  	error => {
  		this.rose('Invalid email or password', console.log(error))
  	  }
  	)
  }

  

}
