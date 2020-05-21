import React, { Component } from 'react'
import api from '../../api'


export default class Profile extends Component {
  state = {
    edit: false,
    editpassword: false,
    username: "",
    email: "",
    id: "",
    message: null,
    oldPassword: "",
    newPassword: "",
    imgPath: "",
    file: null,
  }
  componentDidMount() {
    var user = api.getLocalStorageUser()
    this.setState({ username: user.username, email: user.email, id: user._id, imgPath: user.imgPath })
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  toggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }
  togglePasswordEdit = () => {
    this.setState({ editpassword: !this.state.editpassword })
  }
  saveUser = async () => {
    this.setState({ message: "Lädt..." })
    if (!this.state.username || !this.state.email) {
      this.setState({ message: "Alle Felder ausfüllen!" })
      return
    }
    var newUser = { username: this.state.username, email: this.state.email }
    var updatetUser = await api.updateUserByID(this.state.id, newUser)
    if (this.state.file) {
      var newPicture = await api.updateProfilePicture(this.state.id, { picture: this.state.file })
    }
    if (updatetUser || newPicture) {
      this.setState({ message: "Erfolgreich verändert!" })
      this.toggleEdit()
    }
  }
  savePassword = async () => {
    this.setState({ message: "Lädt..." })
    if (!this.state.oldPassword || !this.state.newPassword) {
      this.setState({ message: "Alle Felder ausfüllen!" })
      return
    }
    let data = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword
    }
    api.updatePasswordByUserId(this.state.id, data)
      .then(newUser => {
        console.log(newUser)
        if (newUser) {
          this.setState({ message: "Erfolgreich verändert!" })
          this.togglePasswordEdit()
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ message: "Das alte Passwort ist falsch" })
      })
  }
  handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    this.setState({
      file: file,
      imgPath: null,
    })
  }
  render() {
    var user = api.getLocalStorageUser()
    console.log("USER", user)
    return (
      <div className="MainContent">
        <h4>Mein Profil</h4>
        {this.state.message && <p>{this.state.message}</p>}
        {this.state.edit ? <React.Fragment>
          <div className="twoRowContent">
            <div className="leftContent">
              <div>Name: <input value={this.state.username} onChange={this.onChange} name="username" /></div>
              <div>Email: <input value={this.state.email} onChange={this.onChange} name="email" /></div>
            </div>
            <div className="rightContent">
              <div>{this.state.imgPath && <img src={this.state.imgPath} alt="Failed to load resource" />}</div>
              <div><label xl={3}>Add/Change picture</label></div>
              <div><input type="file" name="imgPath" onChange={this.handleFileChange} /><br /></div>
            </div>
          </div>
          <button onClick={this.saveUser}>Speichern</button>
          <button onClick={this.toggleEdit}>Abbrechen</button>
        </React.Fragment> :
          this.state.editpassword ?
            <React.Fragment>
              Altes Passwort:<input type="password" value={this.state.oldPassword} name="oldPassword" onChange={this.onChange} />
              Neues Passwort:<input type="password" value={this.state.newPassword} name="newPassword" onChange={this.onChange} />
              <button onClick={this.savePassword}>Speichern</button>
            </React.Fragment> :
            <React.Fragment>
              <div className="twoRowContent">
                <div className="leftContent">
                  <p>Name: {user.username}</p>
                  <p>Email: {user.email}</p>
                </div>
                {user.imgPath && <div className="rightContent">
                  <img src={user.imgPath} alt={user.imgName} />
                </div>}
              </div>
              <button onClick={this.toggleEdit}>Name/Email bearbeiten</button>
              <button onClick={this.togglePasswordEdit}>Passwort bearbeiten</button>
            </React.Fragment>}
      </div>
    )
  }
}
