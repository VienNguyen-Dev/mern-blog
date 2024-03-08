import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {

  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allow to create the comment "))
    }
    const newComment = await Comment.create({
      content,
      postId,
      userId
    })
    await newComment.save();
    res.status(200).json(newComment)
  } catch (error) {
    next(error)
  }
}