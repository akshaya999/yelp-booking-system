import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl ,Validators} from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';

import { YelphttpService } from '../yelphttp.service';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { generate } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';





@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  searchCtrl = new FormControl();
  errorMsg!: string;
  filtered:any;
  isLoading = false


  @ViewChild('closer') closer: any;

  recommended:any;

  modalform = new FormGroup({
    resemail: new FormControl("",Validators.compose([Validators.required, Validators.email])),
    resdate: new FormControl("",Validators.required),
    reshour: new FormControl("",Validators.required),
    resmin: new FormControl("",Validators.required)
  },{updateOn:"submit"})

  mindate = ""


  ngOnInit() {
    this.getDate()

    this.searchCtrl.valueChanges
    .pipe(
      filter(res => {
        return res!==null && res.length>=3
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      tap(()=>{
        this.errorMsg = ""
        this.filtered = [];
        this.isLoading=true;
      }),
      switchMap(value => this.yelp.generatekeyword(value)
      .pipe(
        finalize(()=>{
          this.isLoading=false
        }),
      )
    )
  )
  .subscribe((data:any)=>{
    this.recommended = []
    for(var val of data["terms"]){
      this.recommended.push(val["text"])
    }
    for(var val of data["categories"]){
      this.recommended.push(val["title"])
    }
    this.filtered = this.recommended
  })
  }
  counter = Array;
  

  keyword = ""
  distance = ""
  category = "all"
  location = ""
  latitude = ""
  longitude = ""
  autodec = false
  buisness_id=""

  h1 = true
  h2 = true
  searched = false


  gmaps = {
    lat : 0.0,
    lng : 0.0
  }

  resdate = ""
  resemail = ""
  reshour = ""
  resmin = ""




  getDate(){
    var new_d = new Date();
    var to_date:any = new_d.getDate()

    if(to_date<10){
      to_date="0"+to_date;
    }
    var month:any = new_d.getMonth() + 1; 
    if(month<10){
      month="0"+month;
    }
    var year = new_d.getFullYear()

    this.mindate = year+'-'+month+'-'+to_date
    console.log(this.mindate)
  }



  lnull(){
    this.location = ""
  }

  cleared(){
    this.results=[]
    this.full_data=""

    this.keyword = ""
    this.distance = ""
    this.category = "all"
    this.location = ""
    this.latitude = ""
    this.longitude = ""
    this.autodec = false
    this.searched = false

  }

  onSelected(){
    console.log(this.keyword)
    this.keyword = this.keyword
    console.log(this.keyword)
  }

  constructor(private yelp: YelphttpService) { }

  results = []

  display_address=""
  name = ""
  categories=""
  phone = ""
  price=""
  reviews=[]
  images = []
  yelp_info=""
  status_open=""


  hidden = true
  full_data:any = ""


  Submit(){
    this.h1 = true
    this.h2 = true
    this.hidden = true
    if(!this.autodec){
      this.yelp.generateLatLong(this.location).subscribe((data:any)=>{
        this.latitude = data["results"][0]["geometry"]["location"]["lat"];
        this.longitude = data["results"][0]["geometry"]["location"]["lng"]       
        this.yelp.generateTable(this.keyword,this.latitude,this.longitude,this.distance,this.category).subscribe((data:any)=>{
          this.results=data["businesses"];
          this.searched = true
      })
      })
    }
    else{
      this.yelp.generateipinfo().subscribe((data:any)=>{
        data = data["loc"].split(",");
        this.latitude = data[0];
        this.longitude = data[1];
        this.yelp.generateTable(this.keyword,this.latitude,this.longitude,this.distance,this.category).subscribe((data:any)=>{
          this.results=data["businesses"];
          this.searched = true
      })
      })
    }

  }

  hide(){
    this.hidden = true
  }





  cformat(data:Array<any>){
   
    var ids = [];
    var return1  = ""
 
    for(let result in data){
      return1 += data[result]["title"] + " | "
    }
    return return1.slice(0,-2)
  }

  sformat(data:Array<any>){
   
    var ids = [];
    var return1  = ""
 
    for(let result in data){
      return1 +=" "+ data[result] +" " 
    }
    return return1.slice(0,-2)
  }


  get_reviews(index:string){

    this.yelp.generate_review_card(index.toString()).subscribe((data:any)=>{
      this.reviews = data["reviews"]
    })
  }

  splitter(str:string){
    return str.split(" ")[0]
}

  getid(index:number){

  
    this.yelp.generatecard(index.toString()).subscribe((data:any)=>{
      this.full_data = data
      this.name = data["name"]
      this.display_address=this.sformat(data["location"]["display_address"]);
      this.categories=this.cformat(data["categories"])
      this.gmaps.lat = parseFloat(data["coordinates"]["latitude"])
      this.gmaps.lng = parseFloat(data["coordinates"]["longitude"])
      this.phone = data["display_phone"]
      this.price = data["price"]
      this.yelp_info=data["url"]
      if(data["hours"] && data["hours"][0] && data["hours"][0]["is_open_now"]){
        this.status_open=data["hours"][0]["is_open_now"]?"Open":"Closed";
      }
      this.images = data["photos"]
      this.buisness_id=data["id"]
      this.hidden=false


      this.get_reviews(data["id"])
    })

  }

  mclosed(){
    this.resdate = ""
    this.resemail = ""
    this.reshour = ""
    this.resmin = ""

    this.modalform = new FormGroup({
      resemail: new FormControl("",Validators.compose([Validators.required, Validators.email])),
      resdate: new FormControl("",Validators.required),
      reshour: new FormControl("",Validators.required),
      resmin: new FormControl("",Validators.required)
    },{updateOn:"submit"})
    
  }

  delete(x:any){
    var a:any = window.localStorage.getItem("allvalues")
    var t = JSON.parse(a)

    window.alert("Reservation Cancelled!")
    delete t[x]

    window.localStorage.setItem("allvalues",JSON.stringify(t))

  }
 

  checkls(id:any){
    var d:any = {}
    console.log(id)

    var curr_storage:any = window.localStorage.getItem("allvalues")

    if(curr_storage==null){
      return false
    }

    curr_storage = JSON.parse(curr_storage)

    console.log(curr_storage)
    if(curr_storage.hasOwnProperty(id)){
      console.log("here")
      return true
    }
    return false

  }



  localestorage(){
    console.log(this.resdate,this.resemail,this.reshour,this.resmin)
    
    var d:any = {}
    var a:any = {}

    if(!this.modalform.valid){
        this.modalform = new FormGroup({
        resemail: new FormControl(this.resemail,Validators.compose([Validators.required, Validators.email])),
        resdate: new FormControl(this.resdate,Validators.required),
        reshour: new FormControl(this.reshour,Validators.required),
        resmin: new FormControl(this.resmin,Validators.required)
      },{updateOn:"change"})

      return 
    }
  

    var newarr:any = {
      'resemail':this.resemail,
      'resdate':this.resdate,
      'reshour':this.reshour,
      'resmin':this.resmin,
      'resbname':this.name
    }

    if(window.localStorage.getItem("allvalues")===null){
      d[this.buisness_id]=newarr
      window.localStorage.setItem("allvalues",JSON.stringify(d))
    }
    else{
      a = window.localStorage.getItem("allvalues")
      a = JSON.parse(a)
      a[this.buisness_id]=newarr
      window.localStorage.setItem("allvalues",JSON.stringify(a))
    }
    window.alert("Reservation created!")
    this.closer.nativeElement.click();
  }
}



