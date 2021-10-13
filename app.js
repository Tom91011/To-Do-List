//jshint esversion:6

const express = require("express");
// const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = ({
  name: String
  })

const Item = mongoose.model("Item", itemsSchema)

const buyFood = new Item ({
  name:"Buy Food"
})

const cookFood = new Item ({
  name: "Cook Food"
})

const eatFood = new Item ({
  name: "Eat Food"
})

const defaultArray = [buyFood, cookFood, eatFood]

const listsSchema = {
  name:String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listsSchema)



app.get("/", function(req, res) {

const day = date.getDate();

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultArray, (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log("Initial list added successfully");
        }
      })
      res.redirect("/")
    } else {
      res.render("list", {listTitle: day, newListItems: foundItems});
      };
    }
  )
});

app.post("/", function(req, res){
  const item = req.body.newItem;
  const listName = req.body.list //Gets the list title name (e.g home list, work list etc)
  const newItem  = new Item ({   name: item  })

  if (listName === date.getDate()) {
    newItem.save()
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(newItem)
      foundList.save()
      res.redirect("/"+listName)
})
}});


app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox
  const listTitle = req.body.listName

  Item.findByIdAndDelete(checkedItemId, (err) => {
    if(err) {
      console.log(err);
    } else {
        if (listTitle === date.getDate()) {
          console.log(checkedItemId);
          res.redirect("/")
        } else {
          List.findOneAndUpdate({name: listTitle}, {$pull:{items:{_id:checkedItemId}}}, (err, foundList) => {
            res.redirect("/"+listTitle)
          }
        )
      }
    }
  })
})

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName)
  const list = new List ({
   name: customListName,
   items: defaultArray
 })

 // console.log(customListName);

 List.findOne({name:customListName}, (err, foundList) =>{
   if (!foundList) {
     list.save()
   } else {
     res.render("list",  {
        listTitle:customListName,
        newListItems:foundList.items
      })
     }
 })

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
