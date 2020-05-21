import React, { Component } from 'react'
import api from '../../api'


export default class Search extends Component {
  state = {
    searchField: "",
    results: [],
    searchType: "name",
    message: null
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  fetchData = async () => {
    this.setState({ message: "Lädt..." })
    var results = await api.getPlaylists(this.state.searchField, this.state.searchType)
    console.log("result", results)
    if (results && results.data) {
      if (this.state.searchType === "name" && results.data.playlists) {
        console.log(results.data.playlists.items)
        this.setState({ results: results.data.playlists.items, message: null })
      } else {//6u4KuddLp926mEZHqCOQwg
        console.log(results.data.tracks.items)
        this.setState({ results: [results.data], message: null })
      }
    }
  }
  render() {
    return (
      <div className="MainContent">
        Suche nach:
        <div className="selectTypeWrapper">
          <div className={this.state.searchType === "name" ? "selected selectTypeOption" : "notSelected selectTypeOption"} onClick={() => { this.setState({ searchType: "name" }) }}>Name</div>
          <div className={this.state.searchType === "id" ? "selected selectTypeOption" : "notSelected selectTypeOption"} onClick={() => { this.setState({ searchType: "id" }) }}>Playlist ID</div>
        </div>
        <input name="searchField" value={this.state.searchField} onChange={this.onChange} />
        {this.state.message ? <p>{this.state.message}</p> : <button onClick={this.fetchData}>Suche</button>}
        <div className="searchResults">
          {this.state.results && this.state.results.map(playlist => {
            return <div>{playlist.name}Zu Spotify</div>
          })}
        </div>
      </div >
    )
  }
}
