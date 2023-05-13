const express = require('express');

const path = require('path')
const mongoose = require('mongoose')
const app = express();

// Using middlewares 
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(path.resolve(), "public")))
//seting up view Engine
app.set("view engine", "ejs")


mongoose.connect("mongodb+srv://Shwetadubey:QvtqJ8hdhmn0fhlT@cluster0.ymyddly.mongodb.net/Practical", {
  dbName: "backend"
}).then(() => {
  console.log("Database Connected");
})
  .catch((err) => {
    console.log(err);
  })

const userInfoSchema = new mongoose.Schema({
  name: String,
  email: String,

})
const userInfo = mongoose.model("UserInfo", userInfoSchema)

const users = []
app.get('/', (req, res) => {
  res.render("index", { name: "Shweta Dubey" })
  // res.sendFile("index.html")
});

// app.get('/add', async (req, res) => {
//    await UserInfo.create({ name: "Shweta Dubey", email: "dubeysh@gmail.com" })
    
//       res.send("nice")
//     });



app.get('/success', (req, res) => {
  res.render('success')
});

app.get("/users", (req, res) => {
  res.send({
    users
  })
})

app.post("/contact", async (req, res) => {
const {name, email} = req.body
 await userInfo.create({ name: name, email: email })
  res.redirect('/success')
});

app.listen(5000, () => {
  console.log('Server connected');
});

