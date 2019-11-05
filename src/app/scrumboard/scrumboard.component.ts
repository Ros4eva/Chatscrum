import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumdataService } from '../scrumdata.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag} from '@angular/cdk/drag-drop';
import { CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-scrumboard',
  templateUrl: './scrumboard.component.html',
  styleUrls: ['./scrumboard.component.css']
})
export class ScrumboardComponent implements OnInit {

	TFTW = [];
	TFTD = [];
	verify = [];
  done = [];
  loggedUser;

  constructor(private _route: ActivatedRoute, private _scrumdataService: ScrumdataService, private http: HttpClient) { }

  project_id = 0

  pparticipants = []

  ngOnInit() {
    this.loggedUser = this._scrumdataService.getUser();
  	this.project_id = parseInt((this._route.snapshot.paramMap.get('project_id')));
    this.getProjectGoals();
  }
  

  calculateRole(val) {
    val = val.split("-");
    if ((val[3] % 4) === 3) {
      return 3;
    }
    if ((val[3] % 4) === 2) {
      return 2;
    }
    if ((val[3] % 4) === 1) {
      return 1;
    }
    if ((val[3] % 4) === 0) {
      return 0;
    }
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray
  //       (
  //         event.container.data,
  //         event.previousIndex,
  //         event.currentIndex
  //       );

  //   } else {
  //     console.log(event.container.id)
  //     console.log(event.item.data)
  //     event.item.data[2] = this.calculateRole(event.container.id)
  //     console.log(event.item.data)
  //     this._scrumdataService.updateStatus(event.item.data).subscribe(
  //       data => (console.log(data)),
  //       err => (console.log(err))
  //     )
  //     transferArrayItem
  //       (
  //         event.previousContainer.data,
  //         event.container.data,
  //         event.previousIndex,
  //         event.currentIndex
  //       );
  //   }
  // }


  getProjectGoals() {
  	this._scrumdataService.allProjectGoals(this.project_id).subscribe(
  		data => {
  			console.log(data)
        this.pparticipants = data['data']
        this.pparticipants.forEach(element => {
          element['scrumgoal_set'].forEach(item => {
            if(item['status'] == 0 && item['user'] == element['id']) {
              this.TFTW.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
            }
            if (item['status'] == 1 && item['user'] == element['id']) {
              this.TFTD.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
            }
            if (item['status'] == 2 && item['user'] == element['id']) {
              this.verify.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
            }
            if (item['status'] == 3 && item['user'] == element['id']) {
              this.done.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
            }
            
          });
        });
        
  		},
  		error => {
  			console.log('error', error)
  		}
  	)
  }

  evenPredicate0(item) {
    return ((item.data[5] === item.data[1] && item.data[3] === 2 && item.data[0] === "Quality Analyst") || (item.data[0] === "Owner" && item.data[5] === item.data[1]) || (item.data[0] === "Admin" && item.data[5] === item.data[1]))
  }

  evenPredicate(item) {
    return ((item.data[5] === item.data[1] && item.data[3] === 0 && item.data[0] === "Developer") || (item.data[0] === "Owner" && item.data[5] === item.data[1]) || (item.data[0] === "Admin" && item.data[5] === item.data[1]))
  }

  evenPredicate1(item) {
    return ((item.data[5] === item.data[1] && item.data[3] === 1 && item.data[0] === "Developer") || (item.data[0] === "Owner" && item.data[5] === item.data[1]) || (item.data[0] === "Admin" && item.data[5] === item.data[1]))
  }

  evenPredicate2(item) {
    return ((item.data[5] === item.data[1] && item.data[3] === 2 && item.data[0] === "Quality Analyst") || (item.data[0] === "Owner" && item.data[5] === item.data[1]) || (item.data[0] === "Admin" && item.data[5] === item.data[1]))
  }

  drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        // if (
        //   this.loggedUser.name === event.item.data[0]
        //   ) {
          moveItemInArray
            (
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );

        // } else {
        //   console.log(`You can only move task for ${this.loggedUser.name}`)
        // }

      } else {
        // if (
        //   this.loggedUser.name === event.item.data[0]
        // ) {
          console.log(event.container.id)
          console.log(event.item.data)
          event.item.data[3] = this.calculateRole(event.container.id)
          console.log(event.item.data)
          this._scrumdataService.updateStatus(event.item.data).subscribe(
            data => (console.log(data)),
            err => (console.log(err))
          )
          transferArrayItem
            (
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );
        // } else {
        //   console.log(`You can only move task for ${this.loggedUser.name}`)
        // }
      }
    }

}
