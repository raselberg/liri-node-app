require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
const env = process.env;
var Spotify = require('node-spotify-api');

function spotifyThis(userSongName) {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  spotify
    .search({ type: "track", query: userSongName })
    .then(function (response) {
      for (var i = 0; i < response.tracks.items.length; i++) {
        var artistName = response.tracks.items[i].artists[0].name
        var songName = response.tracks.items[i].name
        var previewUrl = response.tracks.items[i].preview_url
        var albumName = response.tracks.items[i].album.name
        console.log(artistName)
      }
    })
    .catch(function (err) {
      console.log(err);
    })
}

var search = process.argv.slice(3);
var finalSearch = search.join(" ");

var type = process.argv[2]

switch (type) {
  case 'concert-this':
    concertThis(finalSearch)
    break;
  case 'spotify-this':
    spotifyThis(finalSearch)
    break;
  case 'movie-this':
    movieThis(finalSearch)
    break;
  case 'do-what-it-says':
    doWhatItSays()
    break;
  default:
    console.log("No type value found");
}

function concertThis() {
  if (finalSearch === "") {
    console.log('\n')
    console.log("No Artist entered. Please enter an Artist")
    console.log('\n')
  } else {
    axios.get("https://rest.bandsintown.com/artists/" + finalSearch + "/events?app_id=codingbootcamp").then(
      function (response) {
        if (response.data.length <= 0) {
          console.log("No info for this Artist")
        } else {

          for (var i = 0; i < response.data.length; i++) {

            var currData = `\n
            Venue: ${response.data[i].venue.name}
            Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
            Event Date: ${moment(response.data[i].datetime).format('LL')}
          `
            console.log(currData)
          }
        }
      });
  }
}

function movieThis() {

  if (finalSearch === "") {
    finalSearch = "mr+nobody"
  }

  axios.get("http://www.omdbapi.com/?t=" + finalSearch + "&y=&plot=short&apikey=trilogy").then(
    function (response) {

      var currData = `\n
      Title: ${response.data.Title}
      Released: ${response.data.Year}
      IMDB Rating: ${response.data.imdbRating}
      Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
      Country: ${response.data.Country}
      Language: ${response.data.Language}
      Plot: ${response.data.Plot}
      Actors: ${response.data.Actors}
          `
      console.log(currData)
    }
  );
}

function doWhatItSays() {
  console.log("do this function triggered")
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");
    finalSearch = dataArr[1];
    console.log(finalSearch)
    spotifyThis(finalSearch)
  });
}
