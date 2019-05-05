// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// All the functions has to be called here for the device be able to read
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    getLocation();
    changemoney();
    pics();

    



});



// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})
//my code is from here to below
//those variables are public 
//var input;
// the variable rate receives the rate 
var rate;
// the variable lat receives the latitude
var lat;
// the variable lon receives the longitude
var lon;
// the variable moneyiso receives the moneyiso from where the device are and 
//with that information we can get the right rate.
var moneyiso;

// funcion on Error 
function onError(msg) {
    console.log(msg);
}
// This funcion is the function to receivve the latitude and longitude
function getLocation() {
    // Once the position has been retrieved, an JSON object
    // will be passed into the callback function (in this case geoCallback)
    // If something goes wrong, the onError function is the 
    // one that will be run
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}
// geoCallback position receive the latitude and longitude 
function geoCallback(position) {

    

    
    // from the position object
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    // Formatting the data to put it on the front end
    var location = "Lat: " + lat + "<br>Long: " + lon;

    // Placing the data on the front end
    //document.getElementById('position').innerHTML = location;
    // we have to call the openCage function here because this functions need informations from getLocation
    openCage();
    
}
// the variable time receive the time 
var time;
//function openCage is very important she receives the lat and lontitude from getLocation
//With latitude and longitude we are receiving city,country,currency,flag,time, moneyiso
function openCage() {

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // we send latitude and longitude with the public variables from getLocation.
    // to process
     const url = 'https://api.opencagedata.com/geocode/v1/json?q='+lat+'+'+lon+'&key=e7743e208ecf4f0a861f7733d9df9b36';
    
    // a "GET" request to the URL define below
    http.open("GET", url);
    // Sending the request
    http.send();

    // Request has been processed and we have
    http.onreadystatechange = (e) => {

        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response);

        // Extracting the individual values

        var city = responseJSON.results[0].components.city;
        var country = responseJSON.results[0].components.country;
        var currency = responseJSON.results[0].annotations.currency.name;
        var flag = responseJSON.results[0].annotations.flag;
        moneyiso = responseJSON.results[0].annotations.currency.iso_code;
        time = responseJSON.timestamp.created_http;
        var oc = "City: " + city + "<br>Country: " + country + "<br>Currency: " + currency + "<br>Flag:" + flag;
        // Placing formatted data on the front end
        document.getElementById('openCage').innerHTML = oc;
        
        //As getRate getWeather and showtime they need information from openCage I'm iniciating them below.
        getRate();
        getWeather();
        showtime();
    }

}
//this function just format the text to display the date and time in front end.
function showtime(){
    
    var oc= ""+time+"";
    document.getElementById('showtime').innerHTML=oc;

}
//this function receives information about weather
function getWeather() {
    
    var http = new XMLHttpRequest();
    const url = 'https://api.darksky.net/forecast/e5f553b2c2d739a95b1d2783040893c1/'+lat+','+lon;
    // a "GET" request to the URL define below
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onreadystatechange = (e) => {

        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response);

        fahrenheitToCelsius(responseJSON.currently.temperature);
        var tempcelsius = fahrenheitToCelsius(responseJSON.currently.temperature).toFixed(2);
        var wind = responseJSON.currently.windSpeed;
        var cloud = responseJSON.currently.cloudCover*100;
        var humidity = responseJSON.currently.humidity*100;
        var oc2 = "Temperature<br> " + tempcelsius + " °C"+"<br>Wind:" + wind +"Km/h"+ "<br>Cloud: " + cloud +"%" + "<br>Humidity:"+humidity+"%";

        // Placing formatted data on the front end
        document.getElementById('getWeather').innerHTML=oc2;
    }
}

var fToCel;
function fahrenheitToCelsius(fahrenheit) {
    var fTemp = fahrenheit;
    fToCel = (fTemp - 32) * 5 / 9;
    var message = fTemp + '\xB0F an in Celsius is: ' + fToCel + '\xB0C.';
    return fToCel;
}
function readingInput(){

    input = document.getElementById('input').value;

}

function getRate(){

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url= 'https://free.currencyconverterapi.com/api/v6/convert?q=USD_'+moneyiso+'&compact=ultra&apiKey=c2d0c8fe534621454c6e';
    // a "GET" request to the URL define above
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onreadystatechange = (e) => {
        
        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response); 
    
        
        

        //rate = responseJSON.USD_EUR;
        rate = responseJSON[`USD_${moneyiso}`];  //this is the syntax to pass a variable to the api


        var oc3 = "Your Currency money is: "+moneyiso;

        // Placing formatted data on the front end
        document.getElementById('getRate').innerHTML=oc3;
        
    }
}

// Converting in one direction
function convertUsd_Eur(){

    readingInput();
    getRate();
    var result_convert = ((input * rate)+" EUR");
    document.getElementById('result_convert').innerHTML = result_convert;
}
function convertEur_Usd(){
    readingInput();
    getRate();
    var result_convert = (input / rate)+" USD";
    document.getElementById('result_convert').innerHTML = result_convert;

}
function pics(){

    navigator.camera.getPicture(cameraCallback, onError);

}

function cameraCallback(imageData){
    var image = document.getElementById('myImage');
    image.src = imageData;

    
}

function onError(msg){
    alert('Failed: ' + message);
}
