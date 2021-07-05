import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './screen/home-screen/home-screen.component';
import { CourseCreationScreenComponent } from './screen/lecturer/course-creation-screen/course-creation-screen.component';
import { AdminCourseScreenComponent } from './screen/lecturer/admin-course-screen/admin-course-screen.component';

import { CourseLearningScreenComponent } from './screen/course-learning-screen/course-learning-screen.component';
import { CourseDetailScreenComponent } from './screen/course-detail-screen/course-detail-screen.component';

import { WalletComponent } from './components/admin/wallet/wallet.component';
import { LoginScreenComponent } from './screen/login-screen/login-screen.component';
import { WalletScreenComponent } from './screen/wallet-screen/wallet-screen.component';
import { SearchComponent } from './components/course/search/search.component';
import { LearnerManagermentComponent } from './components/admin/learner-managerment/learner-managerment.component';
import { MylearingScreenComponent } from './screen/mylearing-screen/mylearing-screen.component';



const routes: Routes = [
  { path: 'admin/course/:id/edit', component: CourseCreationScreenComponent },
  {path:'admin/login', component:LoginScreenComponent},
  {path:'admin/home', component:AdminCourseScreenComponent},
  
    {
    path: 'admin/managerment/wallet', component: WalletComponent
  },
  {
    path:'learning/:courseId/:sectionId/:lectureId', component: CourseLearningScreenComponent
  },
  {
    path: 'home', component: HomeScreenComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'wallet',
    component: WalletScreenComponent,
  },

  {
    path: 'admin/managerment/learner', component: LearnerManagermentComponent
  },
  
  { 
    path: 'lecturer', component: AdminCourseScreenComponent 
  },

{
    path:'wallet', component:WalletScreenComponent
  },
  {
    path:'detail/:id/:name', component: CourseDetailScreenComponent
  },
  {
    path:'login', component: LoginScreenComponent
  },
  {
    path:'search', component:SearchComponent
  },
  
  { 
    path: 'lecturer', component: AdminCourseScreenComponent 
  },
  { 
    path: 'admin/edit', component: CourseCreationScreenComponent 
  },
  {
    path: 'mylearning', component: MylearingScreenComponent
  },

  { path: 'admin/course/new', component: CourseCreationScreenComponent },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
