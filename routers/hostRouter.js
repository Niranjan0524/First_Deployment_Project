const express = require("express");
const hostRouter=express.Router();
const {getAddHome} = require("../controllers/hostController");
const {postHomeAdded} = require("../controllers/hostController");

const {getHostHomes} = require("../controllers/hostController");
const {getEditHome} = require("../controllers/hostController");

const {postEditHome} = require("../controllers/hostController");

const {postDeleteHome} = require("../controllers/hostController");


hostRouter.get("/addhome",getAddHome);

hostRouter.post("/addhome",postHomeAdded); 

hostRouter.get("/homes",getHostHomes);

hostRouter.get("/homes/editHome/:houseId",getEditHome);

hostRouter.post("/editHome",postEditHome);

hostRouter.post("/deleteHome/:homeId",postDeleteHome);

exports.hostRouter=hostRouter;
