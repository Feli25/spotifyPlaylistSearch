import React, { Component } from 'react'
import api from '../../api'


export default class Search extends Component {
  state = {
    searchField: "",
    results: [],
    searchType: "name"
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  fetchData = async () => {
    var results = await api.getPlaylists(this.state.searchField, this.state.searchType)
    this.setState({ results: results })
  }
  render() {
    return (
      <div className="Search">
        Search
        <select iname="searchType" name="searchType" onChange={this.onChange}>
          <option value="name">Name</option>
          <option value="id">Playlist ID</option>
        </select>
        <input name="searchField" value={this.state.searchField} onChange={this.onChange} />
        <button onClick={this.fetchData}>Search</button>
        {this.state.results && this.state.results.map(playlist => {
          return <div>{playlist.name}</div>
        })}
      </div>
    )
  }
}
