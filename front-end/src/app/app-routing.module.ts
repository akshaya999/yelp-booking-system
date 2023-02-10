import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { BookingsComponent } from './bookings/bookings.component';

const routes: Routes = [
  {path:"search",component:SearchComponent},
  {path:"bookings",component:BookingsComponent},
  {path: '',redirectTo:"/search",pathMatch:'full'},
  {path: '**',redirectTo:"/search",pathMatch:'full'},
  // {path: 'book',redirectTo:"/bookings",pathMatch:'prefix'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
