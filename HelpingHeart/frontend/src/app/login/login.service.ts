import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { IResponse } from '../interfaces/IResponse.interface';
import { IUser } from '../interfaces/IUser.interface';
import { IToken } from '../interfaces/IToken.interface';
import { ILocResponse } from '../interfaces/ILocResponse.interface';

export const INIT_STATE = {
  _id: '',
  fullname: 'Gust',
  email: '',
  jwt: ''
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  state_signal = signal<{jwt: string} & IToken>(INIT_STATE);

  #http = inject(HttpClient);
  #host = 'http://localhost:3000/auth';

  signIn(data: {email: string, password: string}){
    return this.#http.post<IResponse<string>>(this.#host + '/signin', data)
  }

  signUp(data: IUser){
    return this.#http.post<IResponse<string>>(this.#host + '/signup', data)
  }

  getLocation(){
    return this.#http.get<ILocResponse>('http://ip-api.com/json/')
  }

  isLoggedIn(){
    return this.state_signal().jwt !== '';
  }

  getLoggedUserId(){
    return this.state_signal()._id;
  }


}
