const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

router.post('/edit/:id', (req, res, next) => {
  let id = req.params.id
  let { username, email } = req.body
  User.findByIdAndUpdate(id, { username, email })
    .then(user => {
      req.logIn(user, () => {
        user.password = undefined
        res.json(user)
      })
    })
    .catch(err => next(err))
})

router.post('/editPassword/:id', (req, res, next) => {
  let id = req.params.id
  let { oldPassword, newPassword } = req.body
  User.findById(id)
    .then(user => {
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        next(new Error('Password is wrong'))
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(newPassword, salt)
      User.findByIdAndUpdate(id, { password: hashPass })
        .then(newUser => {
          req.logIn(newUser, () => {
            newUser.password = undefined
            res.json(newUser)
          })
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

module.exports = router
