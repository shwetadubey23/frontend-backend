const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const app = express();

// Using middlewares 
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(path.resolve(), "public")))
app.use(cookieParser())


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

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

})
const userInfo = mongoose.model("User", userSchema)


const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies
  if (token) {
    const decodedToken = jwt.verify(token, "wenhuebfrunsd")
    req.user = await userInfo.findById(decodedToken._id)
    next()
  } else {
    res.redirect("/login")
  }
}


app.get('/Home', isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name })
});
// res.sendFile("index.html")

app.get('/login', (req, res) => {
  res.render("login");
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post('/register', async (req, res) => {
  // console.log(req.user);
  const { name, email, password } = req.body
  let user = await userInfo.findOne({ email })
  if (user) {
    return res.redirect("/login");
  }
const hashedPassword = await bcrypt.hash(password, 10)

  user = await userInfo.create({ name, email, password: hashedPassword})
  
  const token = jwt.sign({ _id: user._id }, "wenhuebfrunsd")
  res.cookie("token", token, {
    httpOnly: true, expries: new Date(Date.now() + 60 * 10000)
  })
  res.redirect("/Home")
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body
  let userExist = await userInfo.findOne({ email })
  if (!userExist) {
    return res.redirect("/register")
  }
  const isMatchUser = await bcrypt.compare(password, userExist.password)

  if (!isMatchUser) {
    return res.render("login", { email, message: "Incorrect Password" })
  }
  const token = jwt.sign({ _id: userExist._id }, "wenhuebfrunsd")

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000)
  })
  res.redirect("/Home")

});



app.get('/logout', (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  })
  res.redirect("/Home")

});




app.listen(5000, () => {
  console.log('Server connected');
});

