import axios from 'axios'

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'http://localhost:5000/api',
  withCredentials: true,
})

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

  updateUserByID(id, newData) {
    return service
      .post('/user/edit/' + id, newData)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  updatePasswordByUserId(id, newData) {
    return service
      .post('/user/editPassword/' + id, newData)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)

  },

  async getPlaylists(input, searchType) {
    var cache = await caches.open('searchRequests')
    var responseFromCache = await cache.match(`${searchType}/${input}`)
    var secondTest = await cache.keys()
    console.log("got Respons", responseFromCache, secondTest)
    // if (responseFromCache) {
    //   return responseFromCache
    // } else {
    var playlists = await service.get(`/playlists/search/${input}&${searchType}`)
    if (playlists.status === 200) {
      var response = await cache.put(`${searchType}/${input}`, new Response(playlists))
      console.log("put In cache", response)
      return playlists
    }
    // }
  }
}
