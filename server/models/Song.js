const mongoose = require('mongoose')
const Schema = mongoose.Schema

const songSchema = new Schema(
  {
    spotifyid: String,
    name: String,
    external_url: String,
    popularity: Number,
    albumName: String,
    artists: [String],
    durationMS: Number,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

const Song = mongoose.model('Song', songSchema)
module.exports = Song
