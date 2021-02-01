const express = require("express")
const Category = require('./Category')
const router = express.Router()
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new")
})

router.post("/categories/save", adminAuth, (req, res) => {
  const {
    title
  } = req.body
  if (title === undefined) res.redirect("/admin/categories/new")

  Category.create({
      title,
      slug: slugify(title.toLowerCase())
    })
    .then(
      res.redirect("/admin/categories")
    )
})

router.get("/admin/categories", adminAuth, (req, res) => {
  Category.findAll()
    .then(categories => {
      res.render("admin/categories/index", {
        categories
      })
    })
})

router.post("/categories/delete", adminAuth, (req, res) => {
  const {
    id
  } = req.body
  if (id && !isNaN(id)) {
    Category.destroy({
      where: {
        id
      }
    })
  }
  res.redirect("/admin/categories")
})

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
  const {
    id
  } = req.params
  if (isNaN(id)) res.redirect("/admin/categories")
  Category
    .findByPk(id)
    .then(category => {
      if (!category) res.redirect("/admin/categories")
      res.render("admin/categories/edit", {
        category
      })
    })
    .catch(error => {
      res.redirect("/admin/categories")
    })
})

router.post("/categories/update", adminAuth, (req, res) => {
  const {
    id,
    title
  } = req.body
  Category
    .update({
      title,
      slug: slugify(title.toLowerCase())
    }, {
      where: {
        id
      }
    })
    .then(() => {
      res.redirect("/admin/categories")
    })
})

module.exports = router