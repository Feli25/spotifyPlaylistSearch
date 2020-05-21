const express = require('express')
const router = express.Router()
const axios = require('axios');
const { playlistById, playlistsByName } = require("../exampleRespons")

const Spotifyservice = axios.create({
  baseURL: "https://api.spotify.com/v1"
})
var base64 = Buffer.from(process.env.SPOTIFY_CLIENTID + ":" + process.env.SPOTIFY_CLIENTSECRET).toString('base64')
const instanceSpotifyToken = axios.create({
  baseURL: "https://accounts.spotify.com/api/token",
  headers: { Authorization: "Basic " + base64 }
});



router.get('/search/:input&:type', (req, res, next) => {
  let { input, type } = req.params
  var response = type === "name" ? playlistsByName : playlistById
  // instanceSpotifyToken.post("", { grant_type: "client_credentials" })
  //   .then(token => {
  //     var searchURL = type === "name" ? '/search' : '/playlists/' + input
  //     var params = type === "name" ? { q: input, type: "playlist" } : {}
  //     Spotifyservice.get(searchURL, params, { headers: { Authorization: token } })
  //       .then(response => {
  console.log(response)
  return response
  //       })
  //       .catch(err => { console.log("ERROR", err) })
  //   })
  //   .catch(err => { console.log("ERROR", err) })
})

module.exports = router
