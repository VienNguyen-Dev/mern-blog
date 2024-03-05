import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
  console.log(req.user)
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allow to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide alls required field"))
  }

  const slug = req.body.title.split(" ").join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body, slug, userId: req.user.id
  })
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost)
  } catch (error) {
    next(error)
  }
}