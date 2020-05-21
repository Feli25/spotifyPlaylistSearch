const express = require('express')
const router = express.Router()
const axios = require('axios');
const request = require("request");
const Playlist = require('../models/Playlist')
const Song = require('../models/Song')

function saveNewTrack(track) {
  var song = track.track
  Song.findOne({ spotifyId: song.id })
    .then(response => {
      if (response === null) {
        var artists = song.artists.map(artist => { return artist.name })
        var newSong = new Song({
          spotifyId: song.id,
          name: song.name,
          external_url: song.external_urls.spotify,
          popularity: song.popularity,
          albumName: song.album.name,
          artists: artists,
          durationMS: song.duration_ms,
        })
        newSong.save()
      }
    })
    .catch(err => { console.log("ERROR", err) })
}

function savePlayListData(playlist, tracks) {
  const newPlaylist = new Playlist({
    spotifyId: playlist.id,
    name: playlist.name,
    external_url: playlist.external_urls.spotify,
    images: playlist.images,
    tracks: tracks,
    ownerName: playlist.owner.display_name
  })
  newPlaylist.save()
  tracks.forEach(track => {
    saveNewTrack(track)
  })
}

function findAllPlaylistData(playlist, token) {
  Playlist.findOne({ spotifyId: playlist.id })
    .then(response => {
      if (response === null) {//playlist is not saved yet
        if (playlist.tracks && playlist.tracks.items) {
          savePlayListData(playlist, playlist.tracks.items)
        } else {
          axios.get("https://api.spotify.com/v1/playlists/" + playlist.id, { headers: { Authorization: "Bearer " + token } })
            .then(response => {
              var updatedPlaylist = response.data
              savePlayListData(updatedPlaylist, updatedPlaylist.tracks.items)
            })
            .catch(err => { console.log("ERROR", err) })
        }
      }
    })
    .catch(err => { console.log("ERROR", err) })
}

router.get('/search/:input&:type', (req, res, next) => {
  let { input, type } = req.params

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
      var token = body.access_token
      var searchURL = type === "name" ? '/search?q=' + input + '&type=playlist' : '/playlists/' + input
      axios.get("https://api.spotify.com/v1" + searchURL, { headers: { Authorization: "Bearer " + token } })
        .then(response => {
          var playlists
          if (type === "name") {
            playlists = response.data.playlists.items
          } else if (type === "id") {
            playlists = [response.data]
          }
          playlists.forEach(playlist => {
            findAllPlaylistData(playlist, token)
          })
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
