import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import dotenv from 'dotenv';
dotenv.config();

//Website API testing: Insomnia API testing but i am using Thunder Client to API tesitng
export const signup = async (req, res, next) => {

  const { username, email, password } = req.body;
  //Check username, email and password 
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(400, "All filed are required"))
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword
  });
  await newUser.save();
  try {
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === "") {
    return next(errorHandler(404, "All filed are required"))

  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"))
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRECT)
const {password: pass, ...rest} = validUser._doc;
    res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
  } catch (error) {
    next(error);
  }
}