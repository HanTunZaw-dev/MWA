import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoginService } from './login/login.service';

import { IonicModule } from '@ionic/angular';
import { DesiresModule } from './desires/desires.module';
import { AddApiTokenInterceptor } from './add-api-token.interceptor';


const bootstrap = () => {
  const auth = inject(LoginService);
  return ()=>{
    const localstorage_state = localStorage.getItem('APP_STATE');
    if (localstorage_state){
      auth.state_signal.set(JSON.parse(localstorage_state))
    }
  }
}

export const routes: Routes = [
  { path: '', redirectTo: '/desires', pathMatch: 'full' },
  { path: 'desires',loadChildren: () => import('./desires/desires.module').then(m => m.DesiresModule)},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: 'desires'}

]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    DesiresModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, {bindToComponentInputs: true})
  ],
  providers: [
    provideHttpClient(withInterceptors([AddApiTokenInterceptor])),
    {provide: APP_INITIALIZER, multi: true, useFactory: bootstrap}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
