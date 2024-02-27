
export const test = async (req, res, next) => {
  try {
    res.json("Tesst succcessly")
  } catch (error) {
    next(error)
  }
}
