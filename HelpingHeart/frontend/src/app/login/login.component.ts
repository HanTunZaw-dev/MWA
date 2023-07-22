import { Component, Input, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/IUser.interface';
import { LoginService } from './login.service';
import jwt_decode from 'jwt-decode';
import { IToken } from '../interfaces/IToken.interface';
import { IResponse } from '../interfaces/IResponse.interface';
import { ILocResponse } from '../interfaces/ILocResponse.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  #router = inject(Router)
  #auth = inject(LoginService)
  #location : number[]= [];

  isCheckboxChecked: boolean = true;

  toggleCheckbox(): void {
    this.isCheckboxChecked = !this.isCheckboxChecked;
  }

  ngOnInit(){
    this.#auth.getLocation().subscribe((response: ILocResponse) => {
      this.#location.push(response.lat, response.lon);
    })
  }

  signInForm = inject(FormBuilder).nonNullable.group({
    email: ['', Validators.compose([Validators.email, Validators.required])],
    password: ['', Validators.required]
  })

  signUpForm = inject(FormBuilder).nonNullable.group({
    first: ['', Validators.required],
    last: ['', Validators.required],
    email: ['', Validators.compose([Validators.email, Validators.required])],
    password: ['', Validators.required],
    location: [this.#location]
  })

  signInSubmit(){
    this.#auth.signIn(this.signInForm.value as IUser).subscribe((response: IResponse<string>) => {
      console.log(response)
      if (response.success){
        const token = response.data;
        const userInfo = jwt_decode(token) as IToken;
        console.log(userInfo);
        this.#auth.state_signal.set({
          ...userInfo,
          jwt: token
        });
        console.log(this.#auth.state_signal);
        localStorage.setItem('APP_STATE', JSON.stringify(this.#auth.state_signal()));
        this.#router.navigate(['', '']);
      }else{
        this.presentAlert('Error', response.data);
      }
    })
  }

  signUpSubmit(){
    if (this.signUpForm.controls['first'].valid && this.signUpForm.controls['last'].valid){
      const user = this.signUpForm.value as IUser;
      user.name = {
        first: this.signUpForm.get('first')!.value,
        last: this.signUpForm.get('last')!.value
      }
      this.#auth.signUp(user).subscribe((response: IResponse<string>) => {
        if (response.success){
          this.presentAlert('Success', 'Sign Up Successful.');
          this.toggleCheckbox();
          this.#router.navigate(['', 'login']);
        }else{
          this.presentAlert('Error', response.data);
        }
      })
    }else{
      this.presentAlert('Error', 'Need to fill the data');
    }
  }

  constructor(private alertController: AlertController) {}

  async presentAlert(header: string, msg: string) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
