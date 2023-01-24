const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
require('dotenv').config()

app.use(express.urlencoded({ extended: true })); // json require
const mongoose = require("mongoose"); // mongooose require
mongoose.set("strictQuery", true);

mongoose.connect(
  'mongodb+srv://ajmalazeez:Ajmal786@cluster0.ofcsppw.mongodb.net/furnitica?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Data Base connected')
    }
  }
)


//For not storing Cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// For parsing the url to json,string or array format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Port specified
const port = process.env.PORT;

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "secretpassword",
  })
);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// view engine setup
app.set("view engine", "ejs");

const staticPath = path.join(__dirname, "public"); // Static paths
app.use(express.static(staticPath));
app.use("/public", express.static(path.join(__dirname, "public")));

// user router set
const userRoute = require("./routes/userRouter");
app.use(userRoute);

// admin router set
const adminRoute = require("./routes/adminRouter");
app.use(adminRoute);

app.use((req, res) => {
  res.status(404).render("errorPage", { url: req.url });
});

// For post listening
app.listen(port, () =>
  console.log(`http://localhost:${port}`)
);
