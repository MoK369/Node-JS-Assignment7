 function asyncHandler(middleWare) {
  return (req, res, next) => {
    middleWare(req, res, next).catch((error) => {
      next(error);
    });
  };
}

export default asyncHandler;