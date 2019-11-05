import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';


import { HomepageComponent } from './homepage/homepage.component';
import { ScrumboardComponent } from './scrumboard/scrumboard.component';
import { CreateprojectComponent } from './createproject/createproject.component';
import { ChangeroleComponent } from './changerole/changerole.component';
import { AuthGuard } from './auth.guard';
import { ChangeroleGuard } from './changerole.guard';


const routes: Routes = [
	{path: '', component: HomepageComponent},
	{path: 'home', component: HomepageComponent},
	{path: 'login', component: LoginComponent},
	{path: 'signup', component: SignupComponent},
	{path: 'createproject', component: CreateprojectComponent},
	{path: 'scrumboard/:project_id', component: ScrumboardComponent, canActivate: [AuthGuard] },
	{path: 'changerole/:project_id', component: ChangeroleComponent, canActivate: [AuthGuard, ChangeroleGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }