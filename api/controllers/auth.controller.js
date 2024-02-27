import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

//Website API testing: Insomnia API testing but i am using Thunder Client to API tesitng
export const signup = async (req, res, next) => {

  const { username, email, password } = req.body;
  //Check username, email and password 
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    res.status(400).json({ message: "All fileds are required" })
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