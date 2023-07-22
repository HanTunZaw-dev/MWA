import { Component, OnInit, inject } from '@angular/core';
import { DataService } from './data.service';
import { IDesire } from '../interfaces/IDesire.interface';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [
  ]
})

export class ListComponent implements OnInit {
  loading: Boolean = true;
  #dataService = inject(DataService)
  auth = inject(LoginService);
  #router = inject(Router);
  desires: IDesire[] = [];
  paging: number = 1;
  noNext: Boolean = false;
  removeOne: Boolean = false;
  filteredValue: string = 'Filter By:';

  ngOnInit(): void {
    this.getData(this.paging);
  }

  ngAfterContentChecked() {
    window.scrollTo(0, 0);
    if(this.desires.length < 10){
      this.noNext = true;
    }else{
      this.noNext = false;
    }
    if(this.desires.length === 0){
      this.removeOne = true;
    }else{
      this.removeOne = false;
    }
  }

  trackByFn(index: number, item: any){
    return item._id;
  }

  newDesire(){
    this.#router.navigate(['', "desires", "add"])
  }

  viewDesire(_id: string){
    this.#router.navigate(['', "desires", "details", _id])
  }

  editDesire(_id: string){
    this.#router.navigate(['', "desires", "update", _id])
  }

  deleteDesire(_id: string){
    const result =  confirm('Are you sure you want to delete this request?');
    if(!result){
      return;
    }

    this.#dataService.deleteDesireById(_id).subscribe((response) => {
      this.getData();
    })
  }

  isOwner(desire: IDesire){
  }


  canDelete(desire: IDesire): Boolean{
    return desire && desire.createdBy && desire.createdBy.userId === this.auth.getLoggedUserId();
  }

  movePage(move: number){
    this.paging = this.paging + move;
    if(this.paging < 1) this.paging = 1;
    if(this.filteredValue !== 'Filter By:'){
      this.filterBy(this.filteredValue, this.paging);
    }else{
      this.getData(this.paging);
    }
  }

  filterBy(data: string, page: number = 0){
    this.filteredValue = data;
    this.loading = true;
    this.#dataService.getDesiresFilter(data, page).subscribe((response) => {
      this.desires = response.data;
      this.loading = false;
    })
  }

  filterReset(){
    this.filteredValue = 'Filter By:';
    this.getData();
  }

  getData(page: number = 0){
    this.loading = true;
    this.#dataService.getDesires(page).subscribe((response) => {
      this.desires = response.data;
      this.loading = false;
    })
  }

  isLogged(){
    return this.auth.isLoggedIn();
  }


}
