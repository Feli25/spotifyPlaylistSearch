import React, { Component } from 'react'
import api from '../../api'
//playListId to play with: 6u4KuddLp926mEZHqCOQwg


export default class PlaylistDetails extends Component {
  state = {
    songs: []
  }
  componentDidMount() {
    api.getPlaylistTracks(this.props.selectedPlaylist.id)
      .then(tracks => {
        tracks.forEach(trackId => {
          api.getSongDetails(trackId)
            .then(song => {
              this.setState({ songs: [...this.state.songs, song] })
            })
            .catch(err => { console.log(err) })
        })
      })
      .catch(err => { console.log(err) })
  }
  render() {
    var selectedPlaylist = this.props.selectedPlaylist
    return (
      <React.Fragment>
        {selectedPlaylist.external_urls?.spotify && <button><a href={selectedPlaylist.external_urls?.spotify}>Zu Spotify</a></button>}
        <br /><button onClick={this.props.close}>Schließen</button>
        {selectedPlaylist?.images?.[0] &&
          <img src={selectedPlaylist.images[0].url} alt="playlistImage" />}
        <div>
          <p><strong>Name:</strong> {selectedPlaylist.name}</p>
          <p><strong>Beschreibung:</strong> {selectedPlaylist.description}</p>
          {selectedPlaylist.owner?.display_name && <p><strong>Besitzer:</strong> {selectedPlaylist.owner?.display_name}</p>}
          <p><strong>Songs:</strong><br />{this.state.songs?.length > 0 ?
            <table>
              <thead>
                <th>Name</th>
                <th>Künstler</th>
                <th>Spotify</th>
              </thead>
              {this.state.songs.map(song => {
                return <tbody>
                  <td>{song.name}</td>
                  <td>{song.artists.map(artist => { return artist + ", " })}</td>
                  <td><button className="moreBtn"><a href={song.external_url}>Spotify</a></button></td>
                </tbody>
              })}
            </table>
            :
            "Loading..."}</p>
        </div>

      </React.Fragment>
    )
  }
}
