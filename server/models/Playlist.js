const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistSchema = new Schema(
  {
    _id: String,
    name: String,
    external_url: String,
    images: [Object],
    _tracks: [{ type: Schema.Types.ObjectId, ref: "Song" }],
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
