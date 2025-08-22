 function asyncHandler(middleWare) {
  return (req, res, next) => {
    middleWare(req, res, next).catch((error) => {
      console.log({ error });
      next(error);
    });
  };
}

export default asyncHandler;