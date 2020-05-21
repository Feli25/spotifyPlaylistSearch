import axios from 'axios'

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'http://localhost:5000/api',
  withCredentials: true,
})
// const Spotifyservice = axios.create({
//   baseURL: "https://api.spotify.com/v1/search",
//   // Authorization:
//   // withCredentials: true,
// })

const errHandler = err => {
  console.error(err)
  if (err.response && err.response.data) {
    console.error('API response', err.response.data)
    throw err.response.data.message
  }
  throw err
}

export default {
  service: service,

  isLoggedIn() {
    return localStorage.getItem('user') != null
  },

  getLocalStorageUser() {
    return JSON.parse(localStorage.getItem('user'))
  },

  signup(userInfo) {
    return service
      .post('/signup', userInfo)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  login(email, password) {
    return service
      .post('/login', {
        email,
        password,
      })
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  logout() {
    localStorage.removeItem('user')
    return service.get('/logout')
  },

  // getAccessToken(clientId, redirectUri) {
  //   return axios.get(`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-modify-public&response_type=token`)
  // },

  getPlaylists(input) {
    // this.getAccessToken("3689c3e246a84ae78bfb681a6e58d48b", "www.google.com")
    // return Spotifyservice.get(`q=${input}$type=playlist`)
    //   .then(res => res)
    //   .catch(errHandler)
    return service
      .get('/playlists/search/' + input)
      .then(res => res)
      .catch(errHandler)
  }
}
