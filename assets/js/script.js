$(document).ready(function () {

    $("#search-button").on("click", function () {
        var searchValue = $("#search-value").val();
        addHistory(searchValue);
        $("#search-value").val("");
        searchWeather(searchValue);
        $("#search-value").empty();

    });

    $(".history").on("click", "li", function () {
        //search by history
        searchWeather($(this).text());

    });

    function addHistory(text) {
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(li)
    }


    function searchWeather(searchValue) {


        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=imperial&appid=709d8c5d8b57a1974982c5153576f730`,
            dataType: "json"
        }).then(function (res) {
            $("#today").empty();
            var currentTemp = Math.floor(res.main.temp);
            var feelsTemp = Math.floor(res.main.feels_like)
            var card = $("<div>").addClass("card")
            var title = $("<h3>").addClass("card-title").text(res.name);
            var description = $("<h7>").addClass("card-text").text(res.weather[0].description);
            var cardBody = $("<div>").addClass("card-body").attr("id", "main-card");
            var wind = $("<h7>").addClass("card-text").text("wind speed: " + res.wind.speed);
            var tempDisplay = $("<h7>").addClass("card-text").text("current temp is: " + currentTemp + String.fromCharCode(176));
            var feelsDisplay = $("<h7>").addClass("card-text").text("feels like: " + feelsTemp + String.fromCharCode(176));


            cardBody.append(title, description, tempDisplay, feelsDisplay, wind);
            card.append(cardBody);
            $("#today").append(card)

            //if you want to add a video background the code below is what you need in js.  You would need video element in html and some css

            // if(res.weather.main === "Clouds") {
            //     $("#my-video").attr("src", "cloud.mp4").removeAttribute("class", "hide")

            getUVIndex(res.coord.lat, res.coord.lon);
            getForecast(res.coord.lat, res.coord.lon);

        });
    }

    function getUVIndex(lat, lon) {
        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}5&lon=${lon}&appid=709d8c5d8b57a1974982c5153576f730`,
            dataType: "json",
        }).then(function (response) {
            var uv = $("<p>").text("UV Index: ")
            var btn = $("<span>").addClass("btn btn-sm").text(response.value)
            if (response.value < 3) {
                btn.addClass("btn-success")
            } else if (response.value < 7) {
                btn.addClass("btn-warning")
            } else {
                btn.addClass("btn-danger")
            }

            $("#today .card-body").append(uv.append(btn));
        });
    }
    function getForecast(lat, lon) {
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=709d8c5d8b57a1974982c5153576f730`,
            dataType: "json",
        }).then(function (data) {
            $("#forecast").html("<h4> 5 Day Forecast:</h4>").append("<div class=\"row\">");
            console.log(data)
            console.log(data.current.dt)

           for(var i = 0; i < data.daily.length; i++) {
             var minTemp = Math.floor(data.daily[i].temp.min);
             var maxTemp = Math.floor(data.daily[i].temp.max);
             var column = $("<div>").addClass("col-lg-2"); 
             var card = $("<div>").addClass("card");
             var body = $("<div>").addClass("card-body");
             // get the temp information and append into the card lines 44-46
            var title = $("<h5>").addClass("card-title").text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
            var minTempDisplay = $("<p>").addClass("card-text").text("Low temp: " + minTemp  + String.fromCharCode(176));
            var maxTempDisplay = $("<p>").addClass("card-text").text("High temp: " + maxTemp  + String.fromCharCode(176));
         

             column.append(card.append(body.append(title, minTempDisplay, maxTempDisplay)));
             $("#forecast .row").append(column)
           }

            moment.unix(data.daily[0].dt).format()
            console.log(moment.unix(data.daily[0].dt).format("M/D/YY"))
  
        });
    }

})


//709d8c5d8b57a1974982c5153576f730 open weather api key