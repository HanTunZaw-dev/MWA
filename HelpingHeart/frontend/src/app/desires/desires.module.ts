import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { AddComponent } from './add.component';
import { DetailsComponent } from './details.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [


    ListComponent,
        AddComponent,
        DetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {path: '', redirectTo: 'list', pathMatch: 'prefix'},
      {path: 'list', component: ListComponent},
      {path: 'details/:desire_id', component: DetailsComponent},
      {path: 'add', component: AddComponent},
      //{path: '**', redirectTo: 'list'}
    ])
  ]
})
export class DesiresModule { }
