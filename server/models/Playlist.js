const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistSchema = new Schema(
  {
    spotifyId: String,
    name: String,
    external_url: String,
    images: [Object],
    tracks: [Object],
    ownerName: String
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

const Playlist = mongoose.model('Playlist', playlistSchema)
module.exports = Playlist
