import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Scrumuser } from './scrumuser';
import { Userproject } from './userproject';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrumdataService {

  constructor(private _http: HttpClient) { }

  _url = 'https://liveapi.chatscrum.com/scrum/api/scrumusers/';
  _loginUrl = 'https://liveapi.chatscrum.com/scrum/api-token-auth/';
  _scrumProjectUrl = 'https://liveapi.chatscrum.com/scrum/api/scrumprojects/';
  _goalUrl = 'https://liveapi.chatscrum.com/scrum/api/scrumgoals/';
  token;
  encode;

  public httpOptions = {
  	headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  signup(user: Scrumuser) {
  	return this._http.post<any>(this._url, {'email': user['email'], 'password': user['password'], 'full_name': user['fullname'], 'usertype': user['type'], 'projname': user['projectname']}, this.httpOptions);
  }

  login (user) {
  	return this._http.post<any>(this._loginUrl,{'username': user['email'], 'password': user['password'], 'project': user['projname']}, this.httpOptions)
  }

  loggedIn() {
    return !!localStorage.getItem('token')
  }

  allProjectGoals(project_id) {
    return this._http.get<any>(this._scrumProjectUrl + project_id, this.httpOptions);
  }

  createproject(user: Userproject) {
    return this._http.post<any>(this._url, { 'email': user['email'], 'projname': user['projname'], 'full_name': user['fullname'], 'usertype': 'Owner',}, this.httpOptions);
  }

  // createproject(user: Createproject) {
  //   return this._http.post<any>(this._url, { 'name': user['projname'], 'scrumprojectrole_set': [{ 'role': 'Owner', 'color': 'White', 'user': { 'nickname': 'test1', 'id': '666' }, 'scrumgoal_set': [], 'scrumnote_set': [], 'scrumlog_set': [], 'scrumworkid_set': [] }], 'scrumslack_set': [] }, this.httpOptions);
  // }


  updateUser(user): Observable<any> {
    this.token = this.getUser().token;
    this.encode = JSON.parse(localStorage.getItem('Auth'));
    this.encode = btoa(`${this.encode.email}:${this.encode.password}`);
    return this._http.patch(this._goalUrl + user.id + '/', { role: user.role }, {
      headers: new HttpHeaders()
        .set('Authorization', `Basic ${this.encode}==`)
    })
  }

  updateStatus(user): Observable<any> {
    this.token = this.getUser().token;
    this.encode = JSON.parse(localStorage.getItem('Auth'));
    this.encode = btoa(`${this.encode.email}:${this.encode.password}`);
    return this._http.patch(this._goalUrl + user[3] + '/', { status: user[2] }, {
      headers: new HttpHeaders()
        .set('Authorization', `Basic ${this.encode}==`)
    })
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'))
  }
}