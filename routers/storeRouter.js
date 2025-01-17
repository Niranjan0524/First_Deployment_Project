const express = require("express");

const storeRouter = express.Router();


const {getIndex} = require("../controllers/storeController");
const {getHomes} = require("../controllers/storeController");

const {getHomeDetails} = require("../controllers/storeController");
const {getFavourites} = require("../controllers/storeController");

const {postFavourites} = require("../controllers/storeController");

const {getRules} = require("../controllers/storeController");

//here basically interaction with index.ejs file(view) is done by this model but ideally this should be done by the controller so we move the async function to the controller..
// so basically we will use router only to route the request to the controller and controller will interact with the view
storeRouter.get("/",getIndex);
storeRouter.get("/homes",getHomes);
//now to route the dynamic paths you have to do it here:
storeRouter.get("/homes/:homeId",getHomeDetails);

storeRouter.get("/favourites",getFavourites);

storeRouter.post("/favourites",postFavourites);

storeRouter.get("/rules/:homeId",getRules);

module.exports = storeRouter;