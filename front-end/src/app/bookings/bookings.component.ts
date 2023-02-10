import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  constructor() { }


  temp = {}

  ls = {}

  geti:any =""

  l:number=0

  ngOnInit(): void {

    this.geti =  window.localStorage.getItem("allvalues")
    this.ls = JSON.parse(this.geti)

    if(this.geti)
    {
      this.l = Object.keys(this.ls).length
    }

  }


  delete(x:any){
    var a:any = window.localStorage.getItem("allvalues")
    var t = JSON.parse(a)

    window.alert("Reservation Cancelled!")
    delete t[x]

    this.ls = t
    this.l = Object.keys(this.ls).length
    window.localStorage.setItem("allvalues",JSON.stringify(this.ls))

  }






}
