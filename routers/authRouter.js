const express = require('express');

const authRouter=express.Router();

const {getLogin, preSignup} = require("../controllers/authController");

const {postLogin} = require("../controllers/authController");  

const {getLogout} = require("../controllers/authController");

const {getSignup} = require("../controllers/authController");

const {postSignup} = require("../controllers/authController");


authRouter.get("/login",getLogin);

authRouter.post("/login",postLogin);

authRouter.get("/logout",getLogout);

authRouter.get("/signup", getSignup);

//we can give multiple middlewares in the post method in order.
authRouter.post("/signup",preSignup,postSignup);

module.exports=authRouter;