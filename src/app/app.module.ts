import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GradeCourseComponent } from './components/course/grade-course/grade-course.component';
import { HttpClientModule } from '@angular/common/http';
import { SmallCourseComponent } from './components/course/small-course/small-course.component';
import { HomeScreenComponent } from './screen/home-screen/home-screen.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginScreenComponent } from './screen/login-screen/login-screen.component';
import { CourseDetailScreenComponent } from './screen/course-detail-screen/course-detail-screen.component';
import { DetailInfoCourseComponent } from './components/course/detail-info-course/detail-info-course.component';
import { CardImageComponent } from './components/course/detail-info-course/card-image/card-image.component';
import { SectionCourseComponent } from './components/course/detail-info-course/section-course/section-course.component';
import { ContentCourseComponent } from './components/course/detail-info-course/content-course/content-course.component';
import { AdminCourseScreenComponent } from './screen/lecturer/admin-course-screen/admin-course-screen.component';
import { LecturerCardCourseComponent } from './components/course/small-course/lecturer-card-course/lecturer-card-course.component';
import { CourseCreationScreenComponent } from './screen/lecturer/course-creation-screen/course-creation-screen.component';
import { CourseInfoComponent } from './components/course/full-course/course-info/course-info.component';
import { CourseSectionComponent } from './components/course/full-course/course-section/course-section.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';

import { CourseLearningScreenComponent } from './screen/course-learning-screen/course-learning-screen.component';
import { CommentComponent } from './components/comment/comment/comment.component';
import { SingleCommentComponent } from './components/comment/single-comment/single-comment.component';
import { WalletScreenComponent } from './screen/wallet-screen/wallet-screen.component';
import { WalletComponent } from './components/admin/wallet/wallet.component';
import { TableWalletAdminComponent } from './components/admin/wallet/table-wallet-admin/table-wallet-admin.component';
import { BalanceWalletAdminComponent } from './components/admin/wallet/balance-wallet-admin/balance-wallet-admin.component';
import { AlertViewImageComponent } from './components/admin/wallet/alert-view-image/alert-view-image.component';
import { LearnerWalletComponent } from './components/learner-wallet/learner-wallet.component';
import { TableWalletLearnerComponent } from './components/learner-wallet/table-wallet-learner/table-wallet-learner.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { TransferInformationComponent } from './screen/wallet-screen/transfer-information/transfer-information.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { ShortenPipe } from './components/course/small-course/shorten.pipe';

import { LearnerManagermentComponent } from './components/admin/learner-managerment/learner-managerment.component';
import { TableLearnerManagermentComponent } from './components/admin/learner-managerment/table-learner-managerment/table-learner-managerment.component';
import { AlertComponent } from './components/alert/alert.component';

import { AlertWarningComponent } from './components/admin/alert-warning/alert-warning.component';
import { MylearingScreenComponent } from './screen/mylearing-screen/mylearing-screen.component';
import { ShortenDescription } from './components/course/small-course/lecturer-card-course/shortenDescription.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { EmptyBlockComponent } from './components/empty-block/empty-block.component';
import { SearchTitleComponent } from './components/admin/search-title/search-title.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { key } from './util/google_Key';
import { CourseLectureComponent } from './components/course/full-course/course-section/course-lecture/course-lecture.component';
import { Duration } from './util/duration.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorPageComponent } from './components/loading/error-page/error-page.component';
import { AdminGuard } from './components/guard/admin/admin-guard.guard';
import { CountdownPipe } from './components/course/full-course/course-info/count-down.pipe';
import { Truncate } from './components/course/small-course/lecturer-card-course/Truncate.pipe';
import { CanDeactiveGuard } from './screen/lecturer/course-creation-screen/can-deactive-guard.service';

import { MatSelectModule } from '@angular/material/select';
import { CircleLoadingComponent } from './components/circle-loading/circle-loading.component';
import { ComfirmLeaveComponent } from './components/guard/comfirm-leave/comfirm-leave.component';
import { AlertConfimationComponent } from './components/course/full-course/alert-confimation/alert-confimation.component';
import { InfoDialogComponent } from './components/alert/info-dialog/info-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoteComponent } from './components/course/detail-info-course/note/note.component';
import { TopicComponent } from './components/topic/topic.component';
import { ModifyTopicComponent } from './components/topic/modify-topic/modify-topic.component';
import { TopicDialogComponent } from './components/alert/topic-dialog/topic-dialog.component';
import { TopicScreenComponent } from './screen/topic-screen/topic-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    GradeCourseComponent,
    SmallCourseComponent,
    HomeScreenComponent,
    NavbarComponent,
    FooterComponent,
    LoginScreenComponent,
    CourseDetailScreenComponent,
    DetailInfoCourseComponent,
    CardImageComponent,
    SectionCourseComponent,
    ContentCourseComponent,
    AdminCourseScreenComponent,
    LecturerCardCourseComponent,
    CourseCreationScreenComponent,
    CourseInfoComponent,
    CourseSectionComponent,
    AlertWarningComponent,
    AdminComponent,
    CourseLearningScreenComponent,
    CommentComponent,
    SingleCommentComponent,
    WalletScreenComponent,
    WalletComponent,
    TableWalletAdminComponent,
    BalanceWalletAdminComponent,
    AlertViewImageComponent,
    LearnerWalletComponent,
    TableWalletLearnerComponent,
    NavbarAdminComponent,
    TransferInformationComponent,
    AlertComponent,
    TransferInformationComponent,
    ShortenPipe,
    LearnerManagermentComponent,
    TableLearnerManagermentComponent,
    MylearingScreenComponent,
    ShortenDescription,
    AlertWarningComponent,
    AlertWarningComponent,
    EmptyBlockComponent,
    SearchTitleComponent,
    CourseLectureComponent,
    Duration,
    LoadingComponent,
    ErrorPageComponent,
    CountdownPipe,
    Truncate,
    CircleLoadingComponent,
    ComfirmLeaveComponent,
    AlertConfimationComponent,
    InfoDialogComponent,
    NoteComponent,
    TopicComponent,
    ModifyTopicComponent,
    TopicDialogComponent,
    TopicScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgbModule,
    FormsModule,
    SocialLoginModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatExpansionModule,
    PdfViewerModule,
  ],
  providers: [
    CurrencyPipe,
    AdminGuard,
    CountdownPipe,
    Truncate,
    CanDeactiveGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(key, {
              scope: 'profile email',
            }),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
