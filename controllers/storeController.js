const Homes = require('../Models/Homes');
const ObjectId = require('mongodb').ObjectId;
const User = require('../Models/User');
// main work of controller is to interact with the view

const path = require("path");
const rootDir = require("../utils/pathUtils");

exports.getIndex = (req, res, next) => {
  console.log(req.session);

  if (req.session.isLoggedIn) {
    const userType = req.session.user.userType;

    if (userType === "host") {
      const userId = req.session.user._id;
      Homes.find({ hostId: userId }).then((registeredHomes) => {
        res.render("store/index", {
          houseList: registeredHomes,
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      });
    } else {
      Homes.find().then((homes) => {
        res.render("store/index", {
          houseList: homes,
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      });
    }
  } else {
    Homes.find().then((homes) => {
      res.render("store/index", {
        houseList: homes,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
  }
};
exports.getHomes = (req, res,next) => {
const userId=req.session.user._id;
  Homes.find({ hostId: userId }).then((registeredHomes) => {
    res.render("store/homes", {
      houseList: registeredHomes,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }); 
};


exports.getHomeDetails=(req,res,next)=>{
    const homeId = req.params.homeId;
    console.log(homeId);

    if (!ObjectId.isValid(homeId)) {
      return res.status(400).send("Invalid ID format");
    }
    
    Homes.findById(homeId).then(home => {
      if(!home){
        res.redirect('/404');
      }
      res.render("store/homeDetails", {
        home: home,
        isLoggedIn: req.session.isLoggedIn,
        
        userType: req.session.user.userType,
      });
    });    
};


exports.getFavourites=async (req,res,next)=>{
  const userId=req.session.user._id;

   try{
     const user=await User.findById(userId)
       .populate("favouritesHomes")
       
       res.render("store/favouritesList", {
        houseList: user.favouritesHomes,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
       });
  }
  catch(error){
    console.log(error);
    res.redirect("/");
  }
  

 
};


exports.postFavourites= async (req,res,next)=>{
  const homeId = req.body.homeId;
  console.log("Home id is:",homeId);

  const userId=req.session.user._id;

  try{
    const user=await User.findById(userId);
    if(!user.favouritesHomes.includes(homeId)){
      user.favouritesHomes.push(homeId);
      await user.save();
    }
  }
  catch(error){
    console.log(error);
  }
  finally{
    res.redirect("/favourites");
  }
};


exports.getRules=(req,res,next)=>{

  const homeId=req.params.homeId;
  console.log(homeId);

  const rulesFileName='Random_Things.pdf';
  const filePath=path.join(rootDir,"rules",rulesFileName);

  // res.sendFile(filePath);
  res.download(filePath,rulesFileName);
};