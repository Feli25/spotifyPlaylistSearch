const express = require('express')
const router = express.Router()
const axios = require('axios');
const request = require("request");
const { playlistById, playlistsByName } = require("../exampleRespons")

// const Spotifyservice = axios.create({
//   baseURL: "https://api.spotify.com/v1"
// })
// var base64 = Buffer.from(process.env.SPOTIFY_CLIENTID + ":" + process.env.SPOTIFY_CLIENTSECRET).toString('base64')
// const instanceSpotifyToken = axios.create({
//   baseURL: "https://accounts.spotify.com/api/token",
//   headers: { Authorization: "Basic " + base64 }
// });



router.get('/search/:input&:type', (req, res, next) => {
  let { input, type } = req.params
  // var response = type === "name" ? playlistsByName : playlistById
  // console.log("BASE", base64)
  console.log("here")

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENTID + ":" + process.env.SPOTIFY_CLIENTSECRET
        ).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("SUCCESS")
      console.log(body);
      var token = body.access_token
      var searchURL = type === "name" ? '/search?q=' + input + '&type=playlist' : '/playlists/' + input
      axios.get("https://api.spotify.com/v1" + searchURL, { headers: { Authorization: "Bearer " + token } })
        .then(response => {
          console.log("SUCCESS2")
          console.log(response.data)
          res.json(response.data)
        })
        .catch(err => {
          console.log("ERROR2", err)
          res.json({})
        })
    } else {
      console.log("ERROR")
      console.log(response ? response.statusCode : "");
      console.log(body);
      console.log(error);
    }
  })
})

module.exports = router
