const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")

const connection = require("./database/database")
connection
  .authenticate()
  .then(() => {
    console.log('DB success')
  })
  .catch((error) => {
    console.log('DbError: ', error)
  })

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")

const Category = require("./categories/Category")
const Article = require('./articles/Article')

app.use(session({
  secret: "henckel1909_Node",
  cookie: {
    maxAge: 15000
  }
}))

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", usersController)

app.get("/", (req, res) => {
  Article.findAll({
      order: [
        ['id', 'DESC']
      ],
      limit: 4
    })
    .then(articles => {
      Category.findAll()
        .then(categories => {
          res.render("index", {
            articles,
            categories
          })
        })
    })
})

app.get("/:slug", (req, res) => {
  const {
    slug
  } = req.params
  Article.findOne({
      where: {
        slug
      }
    })
    .then(article => {
      if (!article) res.redirect("/")
      Category.findAll()
        .then(categories => {
          res.render("article", {
            article,
            categories
          })
        })
    })
})

app.get("/category/:slug", (req, res) => {
  const {
    slug
  } = req.params
  Category.findOne({
      where: {
        slug
      },
      include: [{
        model: Article
      }]
    })
    .then(category => {
      if (!category) res.redirect("/")
      Category.findAll()
        .then(categories => {
          res.render("index", {
            articles: category.articles,
            categories
          })
        })
    })
})

app.listen(8080, () => {
  console.log('Server is running...')
})