const express = require("express")
const https = require("https")
const app = express()
const date = require(`${__dirname}/date.js`)

const items = ["Buy Food", "Cook Food", "Eat Food"]
const workItems = []

app.use(express.urlencoded({extended:true}));
app.use(express.static("Public"));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {

  let day = date.getDay()

  res.render("list", {listTitle:day, newListItem:items})
})

app.post("/", (req, res) => {

  const newItem = req.body.newItem
    if (req.body.list === "Work") {
      workItems.push(newItem)
      res.redirect("/work")
    } else {
      items.push(newItem)
      res.redirect("/")
    }
})

app.get("/work", (req, res) => {
  res.render("list", {listTitle: "Work List", newListItem: workItems})
})

app.get("/about", (req, res) => {
  res.render("about")
})

app.post("/work", (req, res) => {
  const workItem = req.body.newItem
  workItems.push(workItem)
  res.redirect("/work")
})

app.listen(3000, () => {
  console.log("server started on port 3000");
})
