import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { IResponse } from '../interfaces/IResponse.interface';
import { IUser } from '../interfaces/IUser.interface';
import { IToken } from '../interfaces/IToken.interface';
import { ILocResponse } from '../interfaces/ILocResponse.interface';
import { IDesire } from '../interfaces/IDesire.interface';

export const INIT_STATE = {
  _id: '',
  fullname: 'Gust',
  email: '',
  jwt: ''
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  state_signal = signal<{jwt: string} & IToken>(INIT_STATE);

  #http = inject(HttpClient);
  #host = 'http://localhost:3000';
  getDesires(page: number){
    if (page == 0)
      return this.#http.get<IResponse<IDesire[]>>(this.#host + '/desires/');
    else
      return this.#http.get<IResponse<IDesire[]>>(this.#host + `/desires?page=${page}`);
  }

  getDesiresFilter(data: string, page: number){
    if (page == 0)
      return this.#http.get<IResponse<IDesire[]>>(this.#host + `/desires/?status=${data}`);
    else
      return this.#http.get<IResponse<IDesire[]>>(this.#host + `/desires?status=${data}&page=${page}`);
  }

  getDesireById(desire_id: string){
    return this.#http.get<IResponse<IDesire>>(this.#host + `/desires/${desire_id}`);
    //return this.#htttp.get<any>('https://api.kanye.rest/');
  }

  addDesire(desire: IDesire){
    return this.#http.post<IResponse<IDesire>>(this.#host + `/desires/`, desire);
  }

  updateDesireById(desire_id: string, desire: IDesire){
    return this.#http.put<IResponse<IDesire>>(this.#host + `/desires/${desire_id}`, desire);
  }

  deleteDesireById(desire_id: string){
    return this.#http.delete<{success: boolean, data: number}>(this.#host + `/desires/${desire_id}`)
  }

  cancelDesireById(desire_id: string){
    return this.#http.put<IResponse<IDesire>>(this.#host + `/desires/${desire_id}`, {operator: "Cancel"});
  }

  closeDesireById(desire_id: string){
    return this.#http.put<IResponse<IDesire>>(this.#host + `/desires/${desire_id}`, {operator: "Close"});
  }

  registerDesireById(desire_id: string){
    return this.#http.post<IResponse<IDesire>>(this.#host + `/desires/${desire_id}/volunteers`, {operator: "Register"});
  }

  unregisterDesireById(desire_id: string, user_id: string){
    return this.#http.put<IResponse<IDesire>>(this.#host + `/desires/${desire_id}/volunteers/${user_id}`, {operator: "Unregister"});
  }

  acceptVolunteer(desire_id: string, user_id: string){
    return this.#http.put<IResponse<IDesire>>(this.#host + `/desires/${desire_id}/volunteers/${user_id}`, {operator: "Accept"});
  }

  rejectVolunteer(desire_id: string, user_id: string){
    return this.#http.put<IResponse<IDesire>>(this.#host + `/desires/${desire_id}/volunteers/${user_id}`, {operator: "Reject"});
  }



}
