const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req, res) => {
  User.findAll()
    .then(users => {
      res.render("admin/users/index", {
        users
      })
    })
})

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create")
})

router.post("/users/create", (req, res) => {
  const {
    email,
    password
  } = req.body

  User.findOne({
    where: {
      email
    }
  }).then(user => {
    if (user) return res.redirect("/admin/users/create")
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    User.create({
        email,
        password: hash
      })
      .then(() => {
        res.redirect("/admin/users")
      })
  })

})

router.post("/users/delete", (req, res) => {
  const {
    id
  } = req.body
  if (id && !isNaN(id)) {
    User.destroy({
      where: {
        id
      }
    })
  }
  res.redirect("/admin/users")
})

router.get("/login", (req, res) => {
  res.render("admin/users/login")
})

router.get("/logout", (req, res) => {
  req.session.user = undefined
  res.redirect("/")
})

router.post("/authenticate", (req, res) => {
  const {
    email,
    password
  } = req.body

  User.findOne({
    where: {
      email
    }
  }).then(user => {

    if (!user) return res.redirect("/login")
    const correct = bcrypt.compareSync(password, user.password)
    if (!correct) return res.redirect("/login")

    req.session.user = {
      id: user.id,
      email: user.email
    }
    res.redirect("/admin/categories")
  })

})

module.exports = router