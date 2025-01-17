
const Homes = require("../Models/Homes");
const { deleteFile } = require("../utils/file");

exports.getAddHome = (req, res, next) => {
  // const editing=req.query.editing==='true';
  res.render("host/editHome", {
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user:req.session.user,
  });
};

exports.postHomeAdded = (req, res, next) => {
  const userId = req.session.user._id;

//this we got from the multer middleware(which has data of the file uploaded)
  console.log("House Req",req.file);
  
  if(!req.file){
    res.status(400).send("Please upload a valid file");
  }
  const newHome = new Homes({
    houseName: req.body.houseName,
    price: req.body.price,
    location: req.body.location,
    rating: req.body.rating,
    photo: req.file ? req.file.path : req.body.photoUrl,
    hostId:userId
  });

  newHome.save().then((result) => {
    res.render("host/HomeAdded",{
      isLoggedIn:req.session.isLoggedIn,
      user:req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  const userId=req.session.user._id;
  Homes.find({hostId:userId}).then((registeredHomes) => {
    res.render("host/hostHomes", {
      houseList: registeredHomes,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getEditHome = (req, res) => {
  //this is how we access path parameter declared in router
  const houseId = req.params.houseId;
  //this is how we access query parameter declared while routing
  const queryParam = req.query.editing === "true";
  // console.log("Query Param:" + queryParam);
  if (!queryParam) {
    console.log("Editing not allowed");
    return res.redirect("/host/homes");
  }
  Homes.findById(houseId).then((home) => {
    if (!home) {
      console.log("House not found");
      return res.redirect("/host/homes");
    }

    res.render("host/editHome", {
      home: home,
      editing: queryParam.valueOf,
      isLoggedIn: req.isLoggedIn,
      user:req.session.user
    });
  });
};

exports.postEditHome = (req, res, next) => {
  console.log(req.body);
  const { id, houseName, price, location, rating, PhotoURL } = req.body;

 
  Homes.findById(id).then(home => {
    if (!home) {
      console.log("House not found");
      return res.redirect("/host/homes");
    }

    if(req.file){
      deleteFile(home.photo);
    }
    const photo = req.file ? req.file.path : req.body.photoUrl;
     
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.photo = photo;

    return home.save();
  }).then(result => {
    res.redirect("/host/homes");
  }).catch(err => {
    console.log("Error in updating the home", err);
  });
};

exports.postDeleteHome=(req,res,next)=>{
    console.log(req.params.homeId);
    const homeId=req.params.homeId;
    Homes.findByIdAndDelete(homeId).then((error)=>{
      if(error){
        console.log("Error in deleting the home",error);
      }
   
      res.redirect("/host/homes");  
      
    });   
};
