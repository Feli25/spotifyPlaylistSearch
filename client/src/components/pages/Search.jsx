import React, { Component } from 'react'
import api from '../../api'


export default class Search extends Component {
  state = {
    searchField: "",
    results: [],
    searchType: "id"
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  fetchData = async () => {
    var results = await api.getPlaylists(this.state.searchField, this.state.searchType)
    console.log("result", results)
    if (results && results.data) {
      this.setState({ results: [results.data] })
      // this.setState({ results: results.data.artists.items })
    }
  }
  render() {
    return (
      <div className="Search">
        Search
        <select className="fields" iname="searchType" name="searchType" onChange={this.onChange}>
          <option value="name">Name</option>
          <option value="id">Playlist ID</option>
        </select>
        <input className="fields" name="searchField" value={this.state.searchField} onChange={this.onChange} />
        <button className="searchButton" onClick={this.fetchData}>Search</button>
        <div className="searchResults">
          {this.state.results && this.state.results.map(playlist => {
            return <div>{playlist.name} <a href={playlist.external_urls.spotify}>Go to spotify</a></div>
          })}
        </div>
      </div>
    )
  }
}
