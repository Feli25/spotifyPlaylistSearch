import React, { Component } from 'react'
import api from '../../api'

export default class Signup extends Component {
  state = {
    username: '',
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
    let data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    }
    try {
      var signup = await api.signup(data)
      if (signup) {
        console.log('SUCCESS!')
        this.props.history.push('/')
        window.location.reload()
      }
    } catch (err) {
      this.setState({ message: err.toString() })
    }
  }

  render() {
    return (
      <div className="MainContent">
        <h2>Registrieren</h2>
        <form>
          Name:{' '}
          <input
            type="text"
            value={this.state.username}
            name="username"
            onChange={this.handleInputChange}
          />{' '}
          <br />
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
          <button onClick={e => this.handleClick(e)}>Signup</button>
        </form>
        {this.state.message && (
          <div className="info info-danger">{this.state.message}</div>
        )}
      </div>
    )
  }
}
