import { Component, Input, OnInit, inject } from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { IDesire } from '../interfaces/IDesire.interface';
import { LoginService } from '../login/login.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Categories } from '../interfaces/CategoryList';
import * as toastr from 'toastr';


@Component({
  selector: 'app-view',
  templateUrl: './detail.component.html',
  styles: [
  ]
})

export class DetailsComponent implements OnInit{
  loading: Boolean = true;
  @Input() desire_id: string = '';
  desire! : IDesire;
  #dataService = inject(DataService)
  #auth = inject(LoginService);
  #router = inject(Router);
  isEdit: Boolean = true;
  items = Categories;
  selectedCategory:string = '';


  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(){
    this.isEdit = true;
  }

  loadData(){
    this.loading = true;
    this.#dataService.getDesireById(this.desire_id).subscribe((response) => {
      this.desire = response.data;
      this.loading = false;
    })
 }

 bindingData(desire : IDesire){
  this.updateForm.get("title")?.patchValue(desire.title);
  this.updateForm.get("category")?.patchValue(desire.category);
  this.updateForm.get("description")?.patchValue(desire.description);
  this.updateForm.get("address")?.patchValue(desire.address);
  this.updateForm.get("estimateInHours")?.patchValue(desire.estimateInHours);
  this.updateForm.get("numberOfVolunteerNeeded")?.patchValue(desire.numberOfVolunteerNeeded);
  this.updateForm.get("requestTime")?.patchValue(desire.requestTime!);
  this.selectedCategory = desire.category;

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

  isOwner(){
    return this.desire && this.desire.createdBy && this.desire.createdBy.userId === this.#auth.getLoggedUserId();
  }

  statusIsOpen(){
    return this.desire.status === "Open";
  }

  isLogged(){
    return this.#auth.isLoggedIn();
  }

  canEdit(): Boolean{
    return this.isOwner() && this.statusIsOpen();
  }

  canCancelRequest(): Boolean{
    return this.isOwner() && this.statusIsOpen();
  }

  canCloseRequest(): Boolean{
    return this.isOwner() && this.statusIsOpen();
  }

  canDelete(): Boolean{
    return this.isOwner();
  }

  editInfo(){
    if(!this.isEdit && this.updateForm.dirty){
      const result =  confirm('Are you sure you want to leave this page? Your changes will be lost.');
      if(!result){
        return;
      }
    }

    this.isEdit = !this.isEdit;
    this.updateForm.markAsPristine();
    this.bindingData(this.desire)
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



  isReqistered(): Boolean{
    const obj =  this.desire!.volunteers!.find(x => x.userId === this.#auth.getLoggedUserId() && (x.status === "Pending" || x.status === "Accepted" || x.status === "Rejected"));
    return obj !== undefined;
  }

  canRegister(): Boolean{
    if(!this.isLogged() || !this.statusIsOpen() || this.isOwner())
      return false;
    const obj =  this.desire!.volunteers!.find(x => x.userId === this.#auth.getLoggedUserId() && (x.status === "Pending" || x.status === "Accepted" || x.status === "Rejected"));
    return obj === undefined;
  }

  canUnRegister(): Boolean{
    if(!this.isLogged() || !this.statusIsOpen() || this.isOwner())
      return false;
    const obj =  this.desire!.volunteers!.find(x => x.userId === this.#auth.getLoggedUserId() && (x.status === "Pending" || x.status === "Accepted"));
    return obj !== undefined;
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
    console.log(this.updateForm.get('requestTime'));
    this.#dataService.updateDesireById(this.desire_id, this.updateForm.value as IDesire).subscribe((response) => {
      if(response.success){
        this.sucess("Request is saved.")
        this.isEdit = true;
        this.loadData();
        this.updateForm.markAsPristine();

      }
      else{
        this.error("Cannot save the request.")
      }
    })
  }

  deleteRequest(){
    const result =  confirm('Are you sure you want to delete this request?');
    if(!result){
      return;
    }

    this.#dataService.deleteDesireById(this.desire_id).subscribe((response) => {
      if(response.success){
        this.sucess("Request is deleted.")
        this.#router.navigate(['', 'desires']);
      }
      else{
        this.error("Cannot delete the request.")
      }
      this.loadData();
    })
  }

  closeRequest(){
    this.#dataService.closeDesireById(this.desire_id).subscribe((response) => {
      if(response.success)
        this.sucess("Request is closed.")
      else{
        this.error("Cannot close the request.")
      }
      this.loadData();
    })
  }

  cancelRequest(){
    this.#dataService.cancelDesireById(this.desire_id).subscribe((response) => {
      if(response.success)
        this.sucess("Request is cancelled.")
      else{
        this.error("Cannot cancle the request.")
      }
      this.loadData();
    })
  }

  registerRequest(){
    this.#dataService.registerDesireById(this.desire_id).subscribe((response) => {
      if(response.success)
        this.sucess("Request is cancelled.")
      else{
        this.error("Cannot cancle the request.")
      }
      this.loadData();
    })
  }

  unregisterRequest(){
    this.#dataService.unregisterDesireById(this.desire_id, this.#auth.getLoggedUserId()).subscribe((response) => {
      if(response.success)
        this.sucess("Request is cancelled.")
      else{
        this.error("Cannot cancle the request.")
      }
      this.loadData();
    })
  }

  acceptVolunteer(user_id: string){
    this.#dataService.acceptVolunteer(this.desire_id, user_id).subscribe((response) => {
      if(response.success)
        this.sucess("Voluteer is accepted.")
      else{
        this.error("Cannot accepte volunteer.")
      }
      this.loadData();
    })
  }

  rejectVolunteer(user_id: string){
    this.#dataService.rejectVolunteer(this.desire_id, user_id).subscribe((response) => {
      if(response.success)
        this.sucess("Voluteer is rejected.")
      else{
        this.error("Cannot rejecte volunteer.")
      }
      this.loadData();
    })
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
    this.selectedCategory = value;
  }

}
