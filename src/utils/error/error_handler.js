function handleError(error, req, res, next) {
  if (error.name == "CustomError") {
    return res
      .status(error.statusCode)
      .json({ success: false, error: error.message });
  }
  if (error.name == "ValidationError" || error.name == "SyntaxError") {
    return res.status(400).json({ success: false, error: error.message });
  }
  if (error.message.includes("E11000 duplicate key error")) {
    if (error.keyPattern.email) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists!" });
    }
    return res.status(409).json({ success: false, error: error.message });
  }
  if(error.name == 'JsonWebTokenError' || error.name == 'TokenExpiredError'){
    console.log({ errorName: error.name,message:error.message });
    return res.status(400).json({success:false,error:"invalid token"})
  }
  console.log({error});
  
  console.log({ errorName: error.name });

  return res.status(500).json({ success: false, error: error.message});
}

export default handleError;
