const express = require('express')
const router = express.Router()
// var baseSpotifyURL = "https://api.spotify.com/v1/playlists/"
// const SpotifyWebApi = require("spotify-web-api-node");
const axios = require('axios');
let buff = new Buffer("3689c3e246a84ae78bfb681a6e58d48b");
let buff2 = new Buffer("d660991a8ea04943b901f0df4f5aa32b")
let base64data = buff.toString('base64') + ":" + buff2.toString('base64')
const Spotifyservice = axios.create({
  baseURL: "https://api.spotify.com/v1/search",
  headers: {
    post: {
      // Authorization: "Basic "+btoa("3689c3e246a84ae78bfb681a6e58d48b:d660991a8ea04943b901f0df4f5aa32b")
    }
  }
})
var base64 = Buffer.from(process.env.SPOTIFY_CLIENTID + ":" + process.env.SPOTIFY_CLIENTSECRET).toString('base64')
const instanceSpotifyToken = axios.create({
  baseURL: "https://accounts.spotify.com/api/token",
  headers: { Authorization: "Basic " + base64 }
});



router.get('/search/:input', (req, res, next) => {
  let { input } = req.params
  instanceSpotifyToken.post("", { grant_type: "client_credentials" })
    .then(token => {
      console.log("test")
      // console.log(res)
      Spotifyservice.get("", { q: input, type: "playlist" }, { headers: { Authorization: token } })
        .then(response => {
          return response
        })
        .catch(err => { console.log("ERROR", err) })
    })
    .catch(err => { console.log("ERROR", err) })
})

module.exports = router
