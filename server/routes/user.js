const express = require('express')
const router = express.Router()
const User = require('../models/User')
const parser = require('../configs/cloudinary.js');
const cloudinary = require('cloudinary');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

router.post('/edit/:id', (req, res, next) => {
  let id = req.params.id
  let { username, email } = req.body
  User.findByIdAndUpdate(id)
    .then(user => {
      if (user.email !== email) {
        console.log("has changed mail")
        User.findOne({ email })
          .then(userDoc => {
            if (userDoc !== null) {
              res.status(409).json({ message: 'The email already exists' })
              return
            } else {
              User.findByIdAndUpdate(id, { username, email })
                .then(response => {
                  User.findById(response.id)
                    .then(updatetUser => {
                      updatetUser.password = undefined
                      res.json(updatetUser)
                    })
                    .catch(err => next(err))
                })
                .catch(err => next(err))
            }
          })
      } else {
        console.log("no change mail")
        User.findByIdAndUpdate(id, { username, email })
          .then(response => {
            User.findById(response.id)
              .then(updatetUser => {
                updatetUser.password = undefined
                res.json(updatetUser)
              })
              .catch(err => next(err))
          })
          .catch(err => next(err))
      }
    })
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
        .then(response => {
          User.findById(response.id)
            .then(updatetUser => {
              updatetUser.password = undefined
              res.json(updatetUser)
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

router.post('/addPicture/:id', parser.single('picture'), (req, res, next) => {
  let id = req.params.id
  let file = req.file;
  User.findById(id)
    .then(user => {
      console.log("found user")
      if (user.public_id) {
        cloudinary.v2.uploader.destroy(user.public_id, function (result) { console.log(result) });
      }
      User.findByIdAndUpdate(id, {
        imgPath: file.url,
        imgName: file.originalname,
        public_id: file.public_id
      })
        .then(response => {
          User.findById(response.id)
            .then(updatetUser => {
              updatetUser.password = undefined
              res.json(updatetUser)
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))

})

module.exports = router
