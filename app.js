const express = require('express')
const res = require('express/lib/response');
const axios = require('axios');
const { append } = require('express/lib/response');
const { response, query } = require('express');



const port = process.env.PORT || 3000;
const cors=require("cors")
const app = express()
app.use(cors({
  origin:'*'
}))

const path = require("path");



const publicPath = path.join(__dirname, "/dist/front-end");

app.use(express.static(publicPath));



function append_url(query,link){

  for(var x in query){
    link+= x + "=" + query[x]
    link+="&"
  }
  link = link.slice(0,-1)
  return link
}

function append_url_2(query,link){

  for(var x in query){
    link+=x
  }
  return link
}


app.get("/autoco",(req,res)=>{
  let link = "https://api.yelp.com/v3/autocomplete?text="
  link = append_url_2(req["query"],link)

  axios.get(link,{ 
    headers: {
      Authorization : 'Bearer mUyPjxf5xlv8qZPO4mIQakoulWX6fAtgi-3BEv5pekU6AdIgv5VWKmNxuNlhNeni1ZaTl6HlPkHYQMgGb-uxesArlmQf6nXWwaHE5J87f8J8PS8SROYc42eGAWseY3Yx'
  }
  }).then(response => {
    res.send(response["data"]);
  })
})



app.get("/ysearch",(req,res)=>{
  let link = "https://api.yelp.com/v3/businesses/search?"
  link = append_url(req["query"],link)
  axios.get(link,{ 
    headers: {
      Authorization : 'Bearer mUyPjxf5xlv8qZPO4mIQakoulWX6fAtgi-3BEv5pekU6AdIgv5VWKmNxuNlhNeni1ZaTl6HlPkHYQMgGb-uxesArlmQf6nXWwaHE5J87f8J8PS8SROYc42eGAWseY3Yx'
  }
  }).then(response => {
    res.send(response["data"]);
    console.log(req["query"])
  })
})

app.get("/bsearch",(req,res)=>{
  let link = "https://api.yelp.com/v3/businesses/"
  link = append_url_2(req["query"],link)

  axios.get(link,{ 
    headers: {
      Authorization : 'Bearer mUyPjxf5xlv8qZPO4mIQakoulWX6fAtgi-3BEv5pekU6AdIgv5VWKmNxuNlhNeni1ZaTl6HlPkHYQMgGb-uxesArlmQf6nXWwaHE5J87f8J8PS8SROYc42eGAWseY3Yx'
  }
  }).then(response => {
    res.send(response["data"]);
  })
})


app.get("/rsearch/:id",(req,res)=>{
  let link = `https://api.yelp.com/v3/businesses/${req.params.id}/reviews`

  axios.get(link,{ 
    headers: {
      Authorization : 'Bearer mUyPjxf5xlv8qZPO4mIQakoulWX6fAtgi-3BEv5pekU6AdIgv5VWKmNxuNlhNeni1ZaTl6HlPkHYQMgGb-uxesArlmQf6nXWwaHE5J87f8J8PS8SROYc42eGAWseY3Yx'
  }
  }).then(response => {
    res.send(response["data"]);
  })
})




app.get("/gmaps/:location",(req,res)=>{

  let link = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.location}&key=AIzaSyAA-B-Ng0HnIOZPnIAc47e2BxLyUKOfwwk`


  axios.get(link).then(response => {
    res.send(response["data"]);
  })
})

app.get("/*", (req, res) => {
  res.redirect("/")
});


app.listen(port)