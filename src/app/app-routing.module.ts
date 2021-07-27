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
import { AdminGuard } from './components/guard/admin/admin-guard.guard';
import { ErrorPageComponent } from './components/loading/error-page/error-page.component';
import { CanDeactiveGuard } from './screen/lecturer/course-creation-screen/can-deactive-guard.service';
import { TopicComponent } from './components/topic/topic.component';
import { ModifyTopicComponent } from './components/topic/modify-topic/modify-topic.component';
import { TopicScreenComponent } from './screen/topic-screen/topic-screen.component';

const routes: Routes = [
  {
    path: 'admin/course/:id',
    component: CourseCreationScreenComponent,
    canActivate: [AdminGuard],
    canDeactivate: [CanDeactiveGuard],
  },

  {
    path: 'admin/home',
    component: AdminCourseScreenComponent,
    canActivate: [AdminGuard],
  },

  {
    path: 'admin/management/wallet',
    component: WalletComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'learning/:courseId/:sectionId/:lectureId',
    component: CourseLearningScreenComponent,
  },
  {
    path: 'home',
    component: HomeScreenComponent,
  },
  {
    path: 'home/:grade',
    component: HomeScreenComponent,
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
    path: 'admin/management/learner',
    component: LearnerManagermentComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'lecturer',
    component: AdminCourseScreenComponent,
  },

  {
    path: 'wallet',
    component: WalletScreenComponent,
  },
  {
    path: 'detail/:id',
    component: CourseDetailScreenComponent,
  },
  {
    path: 'login',
    component: LoginScreenComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },

  {
    path: 'mylearning',
    component: MylearingScreenComponent,
  },
  {
    path: 'not-found',
    component: ErrorPageComponent,
  },
  {
    path: 'admin/topics/:id/edit',
    component: ModifyTopicComponent,
  },
  {
    path: 'admin/topics/:name/:id/reviewer',
    component: TopicScreenComponent,
  },

  {
    path: 'admin/topics',
    component: TopicComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
