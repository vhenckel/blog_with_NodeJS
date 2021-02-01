const express = require("express")
const router = express.Router()
const Article = require("./Article")
const Category = require("../categories/Category")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/articles", adminAuth, (req, res) => {
  Article
    .findAll({
      include: [{
        model: Category
      }]
    })
    .then(articles => {
      res.render("admin/articles/index", {
        articles
      })
    })
})

router.get("/admin/articles/new", adminAuth, (req, res) => {
  Category
    .findAll()
    .then(categories => {
      res.render("admin/articles/new", {
        categories
      })
    })
})

router.post("/articles/save", adminAuth, (req, res) => {
  const {
    title,
    body,
    category
  } = req.body

  Article.create({
      title,
      body,
      categoryId: category,
      slug: slugify(title.toLowerCase()),
    })
    .then(() => {
      res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", adminAuth, (req, res) => {
  const {
    id
  } = req.body
  if (id && !isNaN(id)) {
    Article.destroy({
      where: {
        id
      }
    })
  }
  res.redirect("/admin/articles")
})

router.get("/admin/articles/edit/:id", (req, res) => {
  const {
    id
  } = req.params
  Article
    .findByPk(id)
    .then(article => {
      Category
        .findAll()
        .then(categories => {
          res.render("admin/articles/edit", {
            article,
            categories
          })
        })
    })
})

router.post("/articles/update", adminAuth, (req, res) => {
  const {
    id,
    title,
    body,
    category
  } = req.body

  Article.update({
      title,
      body,
      categoryId: category,
      slug: slugify(title.toLowerCase()),
    }, {
      where: {
        id
      }
    })
    .then(() => {
      res.redirect("/admin/articles")
    })
})

router.get("/articles/page/:page", (req, res) => {
  const {
    page
  } = req.params
  const limit = 4
  let offset = (isNaN(page) || page == 1) ? 0 : limit * (+page - 1)
  console.log(offset)
  Article
    .findAndCountAll({
      limit,
      offset,
      order: [
        ['id', 'DESC']
      ]
    })
    .then(articles => {
      Category
        .findAll()
        .then(categories => {
          const result = {
            articles,
            page: +page,
            next: (offset + limit >= articles.count) ? false : true
          }
          res.render("admin/articles/page", {
            result,
            categories
          })
        })
    })
})

module.exports = router