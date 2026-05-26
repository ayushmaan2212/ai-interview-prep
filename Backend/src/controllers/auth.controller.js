const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TokenBlacklistModel = require("../models/blacklist.model");


/**
 * @route POST /api/auth/register
 * @description register a new user,expects username,email,password in request body
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isUserAlreadyExist = await userModel.findOne({ 
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User already exist" });
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    username,
    email,
    password : hash,
  });

  const token = jwt.sign(
    { id: newUser._id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token);
   
  await newUser.save();

  res.status(201).json({ 
    message: "User registered successfully" ,
    newUser : {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    }
  });

}

/**
 * @route POST /api/auth/login
 * @description login a user,expects email and password in request body 
 * @access Public
 */ 
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token);
  res.status(200).json({ 
    message: "User logged in successfully",
    user : {
      id: user._id,
      username: user.username,
      email: user.email,
    }
   });


}

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if(token){
    await TokenBlacklistModel.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  }else{
    res.status(400).json({ message: "User not logged in" });
  }
}

/**
 * @name getMeController
 * @description get the current logged in user details ,expects token in request cookie
 * @access private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
