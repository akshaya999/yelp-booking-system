import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class YelphttpService {
  constructor(private http: HttpClient) { }

  
generatekeyword(keyword:string){
  return this.http.get(`https://hw8-aks-368105.wl.r.appspot.com/autoco?${keyword}`)
}


  
  generateipinfo(){
      return this.http.get(`https://ipinfo.io/?token=ff0a5f7fb71d3b`)
  }
  
  
  generateLatLong(location:string){
    return this.http.get(`https://hw8-aks-368105.wl.r.appspot.com/gmaps/${location}`)
  }

  generateTable(keyword:string,latitude:string,longitude:string,distance:string,category:string){
   if(distance!==""){
      distance = (parseInt(distance) * 1609).toString()
    }
    else{
      distance = "16090";
    }
    return this.http.get(`https://hw8-aks-368105.wl.r.appspot.com/ysearch?term=${keyword}&latitude=${latitude}&longitude=${longitude}&categories=${category}&radius=${distance}`)

  }

  generatecard(id:string){

    return this.http.get(`https://hw8-aks-368105.wl.r.appspot.com/bsearch?${id}`)

  }

  generate_review_card(id:string){

    return this.http.get(`https://hw8-aks-368105.wl.r.appspot.com/rsearch/${id}`)

  }


}
