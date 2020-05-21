const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistPictureSchema = new Schema(
  {
    _id: String,
    _user: { type: Schema.Types.ObjectId, ref: "User" },
    _playlist: { type: Schema.Types.ObjectId, ref: "Playlist" },
    // header: String,
    imgPath: String,
    imgName: String,
    public_id: String
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

const PlaylistPicture = mongoose.model('PlaylistPicture', playlistPictureSchema)
module.exports = PlaylistPicture
