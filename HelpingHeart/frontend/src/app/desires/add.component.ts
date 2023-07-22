import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IDesire } from '../interfaces/IDesire.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from './data.service';
import { LoginService } from '../login/login.service';
import { Categories } from '../interfaces/CategoryList';
import * as toastr from 'toastr';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [
  ]
})
export class AddComponent implements OnInit {
  #router = inject(Router);
  desire!: IDesire;
  #dataService = inject(DataService)
  #auth = inject(LoginService);

  items = Categories;


  ngOnInit(): void {
    this.desire = {
      _id : '',
      title: '',
      description: '',
      status: 'Open',
      category: '',
      requestTime: new Date(),
      address: '',
      contactInfo: '',
      estimateInHours: 1,
      numberOfVolunteerNeeded: 1,
      updatedAt: new Date(),
      createdBy: {
        userId: this.#auth.state_signal()._id,
        fullname: this.#auth.state_signal().fullname,
        email: this.#auth.state_signal().email
      },
    }
  }

  goBack(){
      if(this.updateForm.dirty){
        const result =  confirm('Are you sure you want to leave this page? Your changes will be lost.');
        if(!result){
          return;
        }
      }
     this.#router.navigate(['', 'desire']);
  }

  updateForm = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    address: ['', Validators.required],
    estimateInHours: [0, Validators.required],
    numberOfVolunteerNeeded: [0, Validators.required],
    requestTime: [new Date(), Validators.required],
  })


  saveRequest(){
    this.#dataService.addDesire(this.updateForm.value as IDesire).subscribe((response) => {
      if(response.success){
        this.sucess("Request is added.")
        this.updateForm.markAsPristine();
        this.goBack()
      }
      else{
        this.error("Cannot add the request.")
      }
    })
  }

  formatDateTime(dateTime: Date | string): string {
    if (!(dateTime instanceof Date)) {
      dateTime = new Date(dateTime);
    }

    if (isNaN(dateTime.getTime())) {
      return '';
    }

    const formattedDateTime = dateTime.toISOString().slice(0, 16);
    return formattedDateTime;
  }


  sucess(message: string){
    console.log(message);
    toastr.success(message);
  }

  error(message: string){
    console.log("Errr:",  message);
    toastr.error(message);
  }

  setCategory(value: string){
    this.updateForm.get('category')?.patchValue(value);
    this.desire.category = value;
  }
}
