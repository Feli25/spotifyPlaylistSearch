import React, { Component } from 'react'
import api from '../../api'


export default class Home extends Component {
  render() {
    var loggedIn = api.isLoggedIn()
    return (
      <div className="Home MainContent">
        <h2>{loggedIn ? "Wilkommen zurück " + api.getLocalStorageUser().username : "Willkommen"}</h2>
        {loggedIn ? <React.Fragment>
          <p>Um nach neuen Playlists zu suchen, klicke auf <a href="/search">"Suche"</a></p>
          <p>Um dein Profil zu sehen und zu bearbeiten, klicke auf <a href="profile">"Mein Profil"</a></p></React.Fragment> :
          <p>Um diese App zu nutzen, musst du bitte ein Profil erstellen!</p>}
      </div>
    )
  }
}
