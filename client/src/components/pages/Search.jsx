import React, { Component } from 'react'
import api from '../../api'
//playListId to play with: 6u4KuddLp926mEZHqCOQwg


export default class Search extends Component {
  state = {
    searchField: "",
    hasChanged: false,
    results: [],
    searchType: "name",
    message: null,
    selectedPlaylist: null
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, hasChanged: true })
  }
  fetchData = async () => {
    if (this.state.hasChanged && this.state.searchField !== "") {
      this.setState({ message: "Lädt..." })
      var results = await api.getPlaylists(this.state.searchField, this.state.searchType)
      if (this.state.searchType === "name" && results?.data?.playlists) {
        this.setState({ results: results.data.playlists.items, message: null, hasChanged: false })
      } else if (results?.data) {
        this.setState({ results: [results.data], message: null, hasChanged: false })
      } else {
        this.setState({ message: "Suche hat keine Ergebnisse gebracht" })
      }
    }
  }
  render() {
    var selectedPlaylist = this.state.selectedPlaylist
    return (
      <div className="MainContent">
        {selectedPlaylist ?
          <React.Fragment>
            {selectedPlaylist?.images?.[0] &&
              <img src={selectedPlaylist.images[0].url} alt="playlistImage" />}
            <div>
              <p><strong>Name:</strong> {selectedPlaylist.name}</p>
              <p><strong>Beschreibung:</strong> {selectedPlaylist.description}</p>
              {selectedPlaylist.owner?.display_name && <p><strong>Besitzer:</strong> {selectedPlaylist.owner?.display_name}</p>}
            </div>
            {selectedPlaylist.external_urls?.spotify && <button><a href={selectedPlaylist.external_urls?.spotify}>Zu Spotify</a></button>}
            <br /><button onClick={() => { this.setState({ selectedPlaylist: null }) }}>Schließen</button>
          </React.Fragment> :
          <React.Fragment>
            Suche nach:
        <div className="selectTypeWrapper">
              <div className={this.state.searchType === "name" ? "selected selectTypeOption" : "notSelected selectTypeOption"} onClick={() => { this.setState({ searchType: "name" }) }}>Name</div>
              <div className={this.state.searchType === "id" ? "selected selectTypeOption" : "notSelected selectTypeOption"} onClick={() => { this.setState({ searchType: "id" }) }}>Playlist ID</div>
            </div>
            <input name="searchField" value={this.state.searchField} onChange={this.onChange} />
            {this.state.message ? <p>{this.state.message}</p> : <button onClick={this.fetchData}>Suche</button>}
            {this.state.results?.length > 0 && <div className="searchResults">
              <table>
                <thead>
                  <th>Name</th>
                  <th>Mehr Infos</th>
                </thead>
                {this.state.results?.map(playlist => {
                  return <tbody key={playlist.id}>
                    <td>{playlist.name}</td>
                    <td><button className="moreBtn" onClick={() => { this.setState({ selectedPlaylist: playlist }) }}>Mehr</button></td>
                  </tbody>
                })}
              </table>
            </div>}</React.Fragment>
        }
      </div >
    )
  }
}
