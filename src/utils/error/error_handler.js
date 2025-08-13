function handleError(error,req,res,next) {
  if ((error.name == "CustomError")) {
    return res
      .status(error.statusCode)
      .json({ success: false, error: error.message });
  }
}

export default handleError;
