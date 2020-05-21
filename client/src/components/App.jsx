import React, { Component } from 'react'
import { Route, Link, NavLink, Switch } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import api from '../api'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: [],
    }
  }

  handleLogoutClick(e) {
    api.logout()
    window.location.reload()
  }

  render() {
    var loggedIn = api.isLoggedIn()
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Spotify Playlist Suchmaschine</h1>
          <NavLink to="/" exact>
            Home
          </NavLink>
          {!loggedIn && <NavLink to="/signup">Registrieren</NavLink>}
          {!loggedIn && <NavLink to="/login">Einloggen</NavLink>}
          {loggedIn && (
            <Link to="/" onClick={e => this.handleLogoutClick(e)}>
              Ausloggen
            </Link>
          )}
        </header>
        <div className="content-wrapper">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signup" component={loggedIn ? Home : Signup} />
            <Route path="/login" component={loggedIn ? Home : Login} />
            <Route render={() => <h2>404</h2>} />
          </Switch>
        </div>
      </div>
    )
  }
}
