const express = require('express')
const router = express.Router()
const axios = require('axios');
const request = require("request");
const Playlist = require('../models/Playlist')
const Song = require('../models/Song')
const PlaylistPicture = require('../models/PlaylistPicture')
const parser = require('../configs/cloudinary.js');
const cloudinary = require('cloudinary');

function saveNewTrack(track) {
  var song = track.track
  var artists = song.artists.map(artist => { return artist.name })
  var newSong = new Song({
    spotifyid: song.id,
    name: song.name,
    external_url: song.external_urls.spotify,
    popularity: song.popularity,
    albumName: song.album.name,
    artists: artists,
    durationMS: song.duration_ms,
  })
  Song.findOne({ spotifyid: song.id })//simultaneously checking for ID and creating new ones => duplicate errors
    .then(response => {
      if (response === null) {

        newSong.save()
          .catch(err => { console.log("ERROR song creation", err) })//This is throwing many errors, have not found a solution to prevent
      }
    })
    .catch(err => { console.log("ERROR", err) })
}

function savePlayListData(playlist, tracks) {
  var filteredTracks = tracks.filter((track) => { if (track.track) { return true } else { return false } })
  var nonUniqueTrackIds = filteredTracks.map(track => { return track.track.id })
  var trackIds = [...new Set(nonUniqueTrackIds)];
  const newPlaylist = new Playlist({
    spotifyid: playlist.id,
    name: playlist.name,
    external_url: playlist.external_urls.spotify,
    images: playlist.images,
    tracks: trackIds,
    ownerName: playlist.owner.display_name
  })
  newPlaylist.save()
    .catch(err => { console.log("ERROR", err) })
  filteredTracks.forEach(track => {
    saveNewTrack(track)
  })
}

function findAllPlaylistData(playlist, token) {
  Playlist.findOne({ spotifyid: playlist.id })
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
  console.log("got search")
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
          console.log("got response")
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

router.get('/tracks/:playlistID', (req, res, next) => {
  let playlistID = req.params.playlistID
  Playlist.findOne({ spotifyid: playlistID })
    .then(playlist => {
      res.json(playlist.tracks)
    })
    .catch(err => next(err))
})

router.get('/songsById/:songId', (req, res, next) => {
  let songId = req.params.songId
  Song.findOne({ spotifyid: songId })
    .then(song => {
      res.json(song)
    })
    .catch(err => next(err))

})

router.get('/playlistPicture/:userid&:playlistid', (req, res, next) => {
  let { userid, playlistid } = req.params
  PlaylistPicture.findOne({ _user: userid, _playlist: playlistid })
    .then(response => {
      res.json(response)
    })
    .catch(err => next(err))
})

router.post('/addPicture/:userid&:playlistid', parser.single('picture'), (req, res, next) => {
  let { userid, playlistid } = req.params
  let file = req.file;
  PlaylistPicture.findOne({ _user: userid, _playlist: playlistid })
    .then(picture => {
      if (picture.public_id) {
        cloudinary.v2.uploader.destroy(picture.public_id, function (result) { console.log(result) });
      }
      var newPic = new PlaylistPicture({
        _user: userid,
        _playlist: playlistid,
        imgPath: file.url,
        imgName: file.originalname,
        public_id: file.public_id
      })
      newPic.save()
        .then(response => { res.json(response) })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

module.exports = router
