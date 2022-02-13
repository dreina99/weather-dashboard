var cityInput = document.getElementById('search-area');
var searchButton = document.getElementById('search');
var cityName = document.getElementById('city-name');
var pastSearches = document.getElementById('past-searches');
var words = [];
var pastLocations = [];
var city = "";
var currDate = moment().format('l');

setSearchHistory();

searchButton.addEventListener('click', function() {
    getCityInput();
});

pastSearches.addEventListener('click', function(event){
    console.log(event.textContent);
})

function getCityInput() {
    city = cityInput.value;
    //console.log(city);

    words = city.split(" ");
    //console.log(words);

    if(words.length === 1)
    {
        city = city.charAt(0).toUpperCase() + city.slice(1);
    }
    else
    {
        for (let i = 0; i < words.length; i++) 
        {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        city = words.join(" ");
    }
    cityName.innerHTML = city + " " + currDate;
    setCityItems();
    //addSearchHistory();
    fetchCoords();
    setCardDates();
    setCurrentHistory();
}

function setCityItems() {
    pastLocations.unshift(city);
    localStorage.setItem("pastLocation", JSON.stringify(pastLocations));
    console.log(pastLocations);
}

function setSearchHistory() {
    pastLocations = JSON.parse(localStorage.getItem("pastLocation"));
    //console.log(pastLocations);
    for(var i = 0; i < pastLocations.length; i++)
    {
        var newSearch = document.createElement("button");
        newSearch.setAttribute("id", pastLocations[i]);
        newSearch.innerHTML = pastLocations[i];
        newSearch.classList.add("past-btn");
        newSearch.classList.add("mt-2");
        pastSearches.appendChild(newSearch);
    }
}

function setCurrentHistory() {
    var newSearch = document.createElement("button");
    newSearch.setAttribute("id", city);
    newSearch.innerHTML = city;
    newSearch.classList.add("past-btn");
    newSearch.classList.add("mt-2");
    pastSearches.insertBefore(newSearch, pastSearches.firstChild);   
}

function fetchCoords() {
    var apiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=95e061fc89e3c58364be7e8ab8cf6e50";
    fetch(apiURL).then(function(response){
        response.json().then(function(data){
            console.log(data);
            var coords = {lat: data[0].lat, lon: data[0].lon};
            console.log(coords);

            fetchWeatherData(coords);
        });  
    });
}

function fetchWeatherData(coords)
{
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords.lat + "&lon=" + coords.lon + 
    "&units=imperial&appid=95e061fc89e3c58364be7e8ab8cf6e50";
    fetch(apiURL).then(function(response) {
        response.json().then(function(data){
            console.log(data);

            var temp = document.getElementById("temp");
            var wind = document.getElementById("wind")
            var humidity = document.getElementById('humidity');
            var uvIndex = document.getElementById("uv");

            temp.innerHTML = data.current.temp;
            wind.innerHTML = data.current.wind_speed;
            humidity.innerHTML = data.current.humidity;
            uvIndex.innerHTML = data.current.uvi;

            if(data.current.uvi >= 0 && data.current.uvi <= 2)
            {
                uvIndex.classList.add("bg-success");
            }
            else if(data.current.uvi >= 3 && data.current.uvi <= 7)
            {
                uvIndex.classList.add("bg-warning")
            }
            else
            {
                uvIndex.classList.add("bg-danger")
            }
            setCardInfo(data);
        });
    });
}

function setCardInfo(data) {
    var card1 = document.getElementById("day1");
    var card2 = document.getElementById("day2");
    var card3 = document.getElementById("day3");
    var card4 = document.getElementById("day4");
    var card5 = document.getElementById("day5");

    var dayCards = [card1, card2, card3, card4, card5];

    for(let i = 0; i < dayCards.length; i++)
    {
        var nextTemp = dayCards[i].getElementsByClassName('day-temp')[0];
        var nextWind = dayCards[i].getElementsByClassName('day-wind')[0];
        var nextHum = dayCards[i].getElementsByClassName('day-humidity')[0];
        var img = dayCards[i].getElementsByClassName('icon')[0];
        nextTemp.innerHTML = data.daily[i + 1].temp.day;
        nextWind.innerHTML = data.daily[i + 1].wind_speed;
        nextHum.innerHTML = data.daily[i+ 1].humidity;

        var icon = data.daily[i + 1].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        img.setAttribute("src", iconurl);   
    }
 
   
}

function setCardDates() {
    var date1 = document.getElementById('date-1'); 
    var date2 = document.getElementById('date-2'); 
    var date3 = document.getElementById('date-3'); 
    var date4 = document.getElementById('date-4'); 
    var date5 = document.getElementById('date-5'); 

    var dates = [date1, date2, date3, date4, date5];

    for(let i = 0; i < dates.length; i++)
    {
        var d1 = moment(currDate, "M-DD-YYYY").add(i+1, 'days');
        var day = d1.format('DD');
        var month = d1.format('M');
        var year = d1.format('YYYY');
        dates[i].innerHTML = month + "/" + day + "/" + year;
    }
}