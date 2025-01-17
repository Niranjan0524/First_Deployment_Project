const User = require("../Models/User");
const bcrypt = require("bcryptjs");



const expressValidator=require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/login",{isLoggedIn:false,errorMessage:[]});
};


exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);

//below is normal then catch block code for handling the promise returned by the findOne function of mongoose
  // User.findOne({ email: email }).then((user)=>{
  //   if(!user){
  //     return res.status(422).render("auth/login",{
  //       isLoggedIn:false,
  //       errorMessage:["Invalid email or password"]
  //     });
  //   }
  //   console.log(user);
  //   req.session.isLoggedIn = true;
  //   res.redirect("/");
  // })
  // .catch((error)=>{
  //   console.log(error);
  //   res.render("auth/login",{isLoggedIn:false,
  //   errorMessage:["Invalid email or password"]
  //   });
  // });

//tryy how to make this code work with async await.
  try{
    const user=await User.findOne({email:email});

//to compare the password entered by the user with the hashed password stored in the database we use the compare function of bcrypt
    const isMatch=await bcrypt.compare(password,user.password);

    if(!user || !isMatch){
      return res.status(422).render("auth/login",{
        isLoggedIn:false,
        errorMessage:["Invalid email or password"]
      });
    }
    req.session.isLoggedIn=true;
//we can store the user object in the session object so that we can use it in the other routes
    req.session.user=user;
    await req.session.save();

    res.redirect("/");
    
  }catch(error){
    console.log(error);
    res.render("auth/login",{isLoggedIn:false,
    errorMessage:[error.message]
    });
  }
};

exports.getLogout=(req,res,next)=>{
  console.log("Logging out");
  req.session.destroy();
  res.redirect("/login");
};


exports.getSignup=(req,res,next)=>{
  res.render("auth/signup", { isLoggedIn: false, errorMessage: [] });
};



//validator function:-

const firstNameValidator = expressValidator.check('name')
  .notEmpty()
  .withMessage("First Name is required")
  .trim()
  .isLength({ min: 2 })
  .withMessage("First Name should be at least 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets");

  const emailValidator = expressValidator.check('email')
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail();

  const passwordValidator = expressValidator.check('password')
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password should contain at least one number");

    const confirmPasswordValidator = expressValidator.check('confirmPassword')
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    });

    const userTypeValidator = expressValidator.check('userType')
    .trim()
    .notEmpty()
    .withMessage("User Type is required")
    .isIn(["normal", "host"])
    .withMessage("Invalid User Type");


//here we can give multiple middleware as array of the funcitons:
exports.preSignup = [
  firstNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,
  (req, res, next) => {

//this is how to get the errors object from the validation:
    const errors = expressValidator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        isLoggedIn: false,
        errorMessage: errors.array().map((error) => error.msg), 
        oldInput: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          usertype:req.body.userType
        }
      });
    }
    next();
  }
];

exports.postSignup=(req,res,next)=>{
  
  const {name,email,password,userType}=req.body;

//syntax for usign bcrypt to hash the password:here 12 is the number of rounds of hashing which means the password will be hashed 12 times
  bcrypt.hash(password,12).then((hashedPassword)=>{
     const user = new User({
       name: name,
       email: email,
       password: hashedPassword,
       userType: userType,
     });

     user
       .save()
       .then((result) => {
         console.log("User Created Successfully");
         res.redirect("/login");
       })
       .catch((error) => {
         return res.status(422).render("auth/signup", {
           isLoggedIn: false,
           errorMessage: [error],
         });
       });
  }) 
  
};