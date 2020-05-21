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
        console.log(results.data)
        this.setState({ results: [results.data], message: null })
      }
    }
  }
  render() {
    return (
      <div className="MainContent">
        Search
        <select value={this.state.searchType} iname="searchType" name="searchType" onChange={this.onChange}>
          <option value="name">Name</option>
          <option value="id">Playlist ID</option>
        </select>
        <input name="searchField" value={this.state.searchField} onChange={this.onChange} />
        {this.state.message ? <p>{this.state.message}</p> : <button onClick={this.fetchData}>Search</button>}
        <div className="searchResults">
          {this.state.results && this.state.results.map(playlist => {
            return <div>{playlist.name}Go to spotify</div>
          })}
        </div>
      </div >
    )
  }
}
