import React, { Component } from 'react'
import api from '../../api'


export default class Profile extends Component {
  render() {
    var user = api.getLocalStorageUser()
    console.log("USER", user)
    return (
      <div className="Profile">
        <p>Mein Profil</p>
        <p>Name: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
    )
  }
}
