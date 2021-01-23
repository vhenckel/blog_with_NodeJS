const express = require("express")
const router = express.Router()

router.get("/articles", (req, res) => {
  res.send("Articles route...")
})

module.exports = router