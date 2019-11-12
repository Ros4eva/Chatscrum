import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumdataService } from '../scrumdata.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag} from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Creategoal } from '../creategoal';
import { Router } from '@angular/router';

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
  USERS = [];

  id;
  data;
  Response;
  loggedUser;
  projectData;
  userId;

  goalData = {
    goalname: null,
  };

  constructor(private _route: ActivatedRoute, private _scrumdataService: ScrumdataService, private router: Router, private http: HttpClient) { }

  project_id = 0

  pparticipants = []

  ngOnInit() {
    this.loggedUser = this._scrumdataService.getUser();
    this.project_id = parseInt((this._route.snapshot.paramMap.get('project_id')));
    this.getProjectGoals();
    this.hideAdminpanel();
    this.openModal();
    
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
        // this.filter(data);
        this.pparticipants = data['data']
        
        // this.pparticipants.forEach(element => {
        //   element['scrumgoal_set'].forEach(item => {
        //     if(item['status'] == 0 ) {
        //       this.TFTW.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
        //     }
        //     if (item['status'] == 1) {
        //       this.TFTD.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
        //     }
        //     if (item['status'] == 2 ) {
        //       this.verify.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
        //     }
        //     if (item['status'] == 3) {
        //       this.done.push([this.loggedUser.role, element['user']['nickname'], item['name'], item['status'], item['id'], this.loggedUser.name])
        //     }
  
        //   });
        // });
        this.filUser();
        this.filter(data)
  		},
  		error => {
  			console.log('error', error)
  		}
  	)
  }

  filUser () {
    this.pparticipants.forEach(element => {
      if(this.USERS.includes(element['user']['nickname'])) {
        console.log('already exist')
      } else {
        this.USERS.push(element['user']['nickname'])
      }

    });
  }


  filter(data) {
    let obj = data["data"]
    console.log(this.loggedUser)
    // console.log(obj)
    Object.keys(obj).map((data1) => {
      obj[data1].scrumgoal_set.map((list) => {
        if (list.status === 0) {

          this.TFTW.push([obj[data1].role, obj[data1].user.nickname, list.name, list.status, list.id, this.loggedUser.name, this.loggedUser.role])

        }
        if (list.status === 1) {
          this.TFTD.push([obj[data1].role, obj[data1].user.nickname, list.name, list.status, list.id, this.loggedUser.name, this.loggedUser.role])
        }
        if (list.status === 2) {
          this.verify.push([obj[data1].role, obj[data1].user.nickname, list.name, list.status, list.id, this.loggedUser.name, this.loggedUser.role])
        }
        if (list.status === 3) {
          this.done.push([obj[data1].role, obj[data1].user.nickname, list.name, list.status, list.id, this.loggedUser.name, this.loggedUser.role])
        }
      })

    })

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
            data => { this.rose("Goal Moved Successfully", (console.log(data))) },
            err => { this.rose("Error Moving Goal", (console.log(err))) }
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

    hideAdminpanel() {
      if (this.loggedUser.role != 'Admin' && this.loggedUser.role != 'Owner') {
        document.getElementById('admin').style.display = "none"
      }
    }

  createGoalModel = new Creategoal('', Number(localStorage.getItem('userID')))

  // onCreateGoal() {
  //   console.log(this.createGoalModel)
  //   this._scrumdataService.createUserGoal(this.createGoalModel).subscribe(
  //     data => console.log('Success', data),
  //     error => console.log('Error',error)
  //   )
  // }


  rose(message, data) {
    var x = document.getElementById("alert");
    document.getElementById('alert').innerHTML = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }

  onCreateGoal() {
    console.log(this.loggedUser)
    let data = this.pparticipants

    data.map((list) => {
      if (list.user.nickname === this.loggedUser.name) {
        this.userId = this.loggedUser.role_id
        console.log(this.userId)
      }
    })
    let Data = { goalname: this.goalData.goalname, user: 'm' + this.userId, id: this.loggedUser.project_id }
    console.log(Data)
    /* this._scrumdataService.addGoal(Data).subscribe(
      result => {
        console.log(result)
        let data = { project_id: this.loggedUser.project_id}
        console.log(data)
        this._scrumdataService.createSprint(data).subscribe(
          data => (console.log(data)),
          err => (console.log(err))
        )
        this.router.navigate(['/scrumboard',this.loggedUser.project_id ])
      } ,
      err => {
        this.Response = "Error Creating Goal"
        console.log(err)
        
      }
    ); */

    let data1 = { project_id: this.loggedUser.project_id }

    this._scrumdataService.addGoal(Data).subscribe(
      result => {
        this.rose("Goal Created Successfully", console.log(result))
        location.reload();
      },
      err => {this.rose("Error Creating Goal", (console.log(err)))}
    )
  }

  startSprint() {
    let data1 = { project_id: this.loggedUser.project_id }
    this._scrumdataService.createSprint(data1).subscribe(
      result => {
        this.rose("New Sprint Started Successfully", console.log(result))
      },
      err => { this.rose("Error Starting New Sprint", (console.log(err))) }
    )
  }

  openModal(){
     const modal = document.getElementById("myModal");

     const btn = document.getElementById("myBtn");

     const span = document.getElementById("close");

    btn.onclick = function () {
      modal.style.display = "block";
    }

    span.onclick = function () {
      modal.style.display = "none";
    }

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    
  }
  
}
