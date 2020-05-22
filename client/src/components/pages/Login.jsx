import React, { Component } from 'react'
import api from '../../api'

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    message: null,
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleClick = async (e) => {
    e.preventDefault()
    try {
      var login = await api.login(this.state.email, this.state.password)
      if (login) {
        this.props.history.push('/')
        window.location.reload()
      } else {
        this.setState({ message: "Etwas hat nicht geklappt" })
      }
    } catch (err) {
      this.setState({ message: err.toString() })
    }
  }

  render() {
    return (
      <div className="MainContent">
        <h2>Einloggen</h2>
        <form>
          Email:{' '}
          <input
            type="email"
            value={this.state.email}
            name="email"
            onChange={this.handleInputChange}
          />{' '}
          <br />
          Passwort:{' '}
          <input
            type="password"
            value={this.state.password}
            name="password"
            onChange={this.handleInputChange}
          />{' '}
          <br />
          <button onClick={this.handleClick}>Login</button>
        </form>
        {this.state.message && (
          <div className="info info-danger">{this.state.message}</div>
        )}
      </div>
    )
  }
}
