//When the page is loaded, the below functions are called.
$(document).ready(function () {
  //Grabs the search button by ID form the HTML and then creates a function to specify what happens when the search button is clicked
  $("#search-button").on("click", function () {
    //creates a global variable for the value of the text inputted into the search value form element
    var searchTerm = $("#search-value").val();
    //upon clicking the search button, the search value form elelment will go blank
    $("#search-value").val("");
    //calls the weatherFunction and passes the searchTerm variable as an argument for the weatherFunction
    weatherFunction(searchTerm);
    //calls the weatherForcast and passes the searchTerm variable as an argument for the weatherForecast
    weatherForecast(searchTerm);
  });

  //This code adds an event listener to the "keypress" event of the element with the ID "search-button". 
  //The function that is passed as the event listener takes an event object as its argument, which contains information about the key that was pressed.
  $("#search-button").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
      weatherFunction(searchTerm);
      weatherForecast(searchTerm);
    }
  });

  
  //This code retrieves data from the web browser's localStorage object and parses it as a JSON object. It assigns the resulting object to the variable history. If localStorage.getItem("history") returns null or undefined, the code assigns an empty array to history using the logical OR operator (||).
  var history = JSON.parse(localStorage.getItem("history")) || [];

  //This code checks if the length of the history array is greater than 0. If the history array has at least one element, it will call the weatherFunction function with the last element of the history array as an argument.
  //Because arrays are indexed, the first elelment in the array will be numbered 0, so in order to target the last elelment in the array, you must subtract 1 from the total length of the array.
  if (history.length > 0) {
    weatherFunction(history[history.length - 1]);
  }
  //makes a row for each element in history array(searchTerms)
  for (var i = 0; i < history.length; i++) {
    createRow(history[i]);
  }

  //The new list item element is given a CSS class of list-group-item using the jQuery addClass() method. Then, the text parameter is added to the content of the list item using the jQuery text() method.
  //puts the searched cities underneath the previous searched city 
  function createRow(text) {
    var listItem = $("<li>").addClass("list-group-item").text(text);
    $(".history").append(listItem);
  }

  //This code sets up a jQuery event listener for the click event on all li elements that are descendants of an element with the CSS class history. When an li element is clicked, the function passed as the third argument to .on() is executed.
  //Inside the function, the text content of the clicked li element is passed as an argument to two functions: weatherFunction() and weatherForecast(). It's likely that these functions are designed to process weather data in some way, such as displaying it on a website or making a decision based on the data.
  $(".history").on("click", "li", function () {
    weatherFunction($(this).text());
    weatherForecast($(this).text());
  });

//This function makes an AJAX call to the OpenWeatherMap API to retrieve the current weather data for the location specified by the searchTerm parameter.
//type: "GET" specifies that this request should use the HTTP GET method. url specifies the URL of the OpenWeatherMap API endpoint, which includes the searchTerm parameter passed to the function and an API key.
  function weatherFunction(searchTerm) {

    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=9f112416334ce37769e5c8683b218a0d",

//the code then checks if the searchTerm value already exists in the history array. 
//If it does not exist, the code then adds the searchTerm to the history array, saves the updated history array to local storage using localStorage.setItem(), and calls the createRow() function to create a new row in the HTML table to display the search term. 
    }).then(function (data) {
      //if index of search value does not exist
      if (history.indexOf(searchTerm) === -1) {
        //push searchValue to history array
        history.push(searchTerm);
        //places item pushed into local storage
        localStorage.setItem("history", JSON.stringify(history));
        createRow(searchTerm);
      }
      // clears out old content
      $("#today").empty();

//An h3 elelment is created with the bootstrap card-title class. The .text method sets the text assigned to the h3 elelemnt. 
//the data.name property contains the name of the specific city. 
//the new Date().toLocaleDateString() method returns the current date in a localized date string format
      var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
    
  //An img element is created. The .attr method is used to specify the source of the image with its specific url from the API
  //The weather property of the data object is an array of objects, and the [0] index is used to access the first object in the array.
      var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

//Creates a div elelement with the bootstrap class card
      var card = $("<div>").addClass("card");
    
  //creates a div with the bootstrap class card-body
      var cardBody = $("<div>").addClass("card-body");

  //creates a paragraph element with the bootstrap class card-text. And uses the .text method to assign the p element text content. The data object contains the weather information for the specific locvation. The wind property of the data object specifies the wind conditions of the specific location. The speed property of the wind object contains the wind speed for that specific location. 
      var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
      var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
      var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");
      console.log(data)
   
//The coord property of the data object is an object that contains two properties, lon and lat, which respectively represent the longitude and latitude coordinates for the specified location.
      var lon = data.coord.lon;
      var lat = data.coord.lat;

//retrieves information about the UV Index for a specific location, using the latitude and longitude coordinates previously retrieved from the API.
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=9f112416334ce37769e5c8683b218a0d&lat=" + lat + "&lon=" + lon,

//The then() method is used to handle the response returned by the API. The response is stored in a variable called response.
      }).then(function (response) {
        console.log(response);

        var uvColor;
        var uvResponse = response.value;
//The code then creates a few variables and HTML elements to display the UV Index information on the page.
        var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);

//The btn-success bootstrap class makes the button green
//The btn-warning bootstrap class makes the button yellow
//The btn-danger bootstrap class makes the button red
        if (uvResponse < 3) {
          btn.addClass("btn-success");
        } else if (uvResponse < 7) {
          btn.addClass("btn-warning");
        } else {
          btn.addClass("btn-danger");
        }
//appends the uvIndex element, which was previously created, to the cardBody element.
//selects the card body element for today's weather, specifically an element with the ID "today" and the class "card-body". It then appends the uvIndex element to this selected element, and then appends the btn element to the uvIndex element.
        cardBody.append(uvIndex);
        $("#today .card-body").append(uvIndex.append(btn));

      });

  //Essentially merges each elelment created in the weather function to display the elelements in the div with the today ID
  //The image gets appended to the title
  //The title, temp, humidity, and wind variables which contain the specific elelments get appended to the cardBody elelment which is a div
  //The cardbody div gets appended to the card div

      title.append(img);
      cardBody.append(title, temp, humid, wind);
      card.append(cardBody);
      $("#today").append(card);
      console.log(data);
    });
  }
  // function weatherForecast(searchTerm) 
  function weatherForecast(searchTerm) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=9f112416334ce37769e5c8683b218a0d&units=imperial",

    }).then(function (data) {
      console.log(data);
      
  //Creates an h4 element and div with the bootstrap class row in the div with the id of forecast 
  //The .html method is used to set the h4 and div within the html
      $("#forecast").html("<h4 class=\"m-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

      //loop to create a new card for 5 days pull data image from search
      for (var i = 0; i < data.list.length; i++) {
//Essentially saying if the name of the city exists then do the following
//checking if the timestamp corresponds to a time of 3:00 PM (15:00 in military time), and if it does, it will execute the code within the conditional statement
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

          var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
          var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
          var colFive = $("<div>").addClass("col-md-2.5");
          var cardFive = $("<div>").addClass("card bg-primary text-white");
          var cardBodyFive = $("<div>").addClass("card-body p-2");
          var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
          var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

          //merge together and put on page
          colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
          //append card to column, body to card, and other elements to body
          $("#forecast .row").append(colFive);
        }
      }
    });
  }

});