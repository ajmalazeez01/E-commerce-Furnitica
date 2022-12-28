const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true })); //json require
const mongoose = require("mongoose"); //mongooose require
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://127.0.0.1:27017/project",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Data Base connected");
    }
  }
);

app.set("view engine", "ejs"); //view engine setup

app.listen(3002, () => console.log("http://localhost:3002/login"));

const staticPath = path.join(__dirname, "public"); // Static paths
app.use(express.static(staticPath));
app.use("/public", express.static(path.join(__dirname, "public")));
const userRoute = require("./routes/userRouter"); // userrouter set
app.use(userRoute);

const adminRoute = require("./routes/adminRouter"); //admin router set
app.use(adminRoute);
