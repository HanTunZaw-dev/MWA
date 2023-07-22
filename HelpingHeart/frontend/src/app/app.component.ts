import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { INIT_STATE, LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  #router = inject(Router);
  auth = inject(LoginService)
  
  signIn(){
    this.#router.navigate(['', 'login'])
  }

  signout() {
    this.auth.state_signal.set(INIT_STATE);
    localStorage.clear();
    this.#router.navigate(['', '']);
  }
}
