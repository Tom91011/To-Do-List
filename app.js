const express = require("express")
const https = require("https")
const app = express()

let items = ["Buy Food", "Cook Food", "Eat Food"]

app.use(express.urlencoded({extended:true}));
app.use(express.static("Public"));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  let today  = new Date();
  let day = today.toLocaleDateString("en-US", options)

  res.render("list", {kindOfDay:day, newListItem:items})
})

app.post("/", (req, res) => {
  const newItem = req.body.newItem
  items.push(newItem)
  res.redirect("/")
})

app.listen(3000, () => {
  console.log("server started on port 3000");
})
