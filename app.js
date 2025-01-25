//this variable is sent by the heroku server and it is used to determine the environment in which the app is running
//if the app is running in the production environment then the value of this variable will be production

//basically we have set production as the default value of the environment variable
const ENV = process.env.NODE_ENV || "production";
require("dotenv").config({
  path: `.env.${ENV}`,
});

const fs= require("fs"); 

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const helmet=require("helmet");
const compression=require("compression");

const app = express();

app.use(helmet());
app.use(compression());

const { hostRouter } = require("./routers/hostRouter");
const storeRouter = require("./routers/storeRouter");
const rootDir = require("./utils/pathUtils");
const morgan=require("morgan");

const accessLogStream=fs.createWriteStream(path.join(rootDir,"access.log"),{flags:"a"});

app.use(morgan("combined",{stream:accessLogStream}));

app.set("view engine", "ejs");
app.set("views", "views");

const { errorHandler } = require("./controllers/errorController");

const authRouter = require("./routers/authRouter");

const url = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@xdb.mjwzy.mongodb.net/${process.env.MONGO_DB_DATABASE}`;

const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);

//to handle the file uploads we use the multer package
const multer = require("multer");

//this is the configuration object for the multer
const storage = multer.diskStorage({
  //basically this is for the destination where the file will be stored
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  //this is how we give custome file name to the file uploaded
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

//this is the file filter function which will be called by multer to check if the file uploaded is of the correct type or not
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage, fileFilter }).single("photo"));

app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use(express.static(path.join(rootDir, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

//we are creating a new instance of mongodbStore and we are passing the configuration object
const store = new mongodbStore({
  uri: url,
  collection: "sessions",
});

app.use(
  session({
    //this is the configuration object where secret is the key and value is the secret key(we can give any value)
    secret: "my secret",
    //resave is nothing but if the session is not changed then it will not be saved
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  console.log("Request Recived");
  console.log(req.url);
  console.log(req.body);
  next();
});

app.use((req, res, next) => {
  if (req.get("cookie")) {
    req.isLoggedIn = req.get("Cookie").split("=")[1] === "true";
  }
  next();
});

app.use(storeRouter);

app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});

app.use("/host", hostRouter);

app.use(authRouter);

app.use(errorHandler);

//here we are giving || because if the port is not available then we will use 3000 as the port
const port = process.env.PORT || 3000;

//we will start the server only once the connection is done with the database..

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
