export const asyncHandler = (requestHandler) => {
  return function (req, res, next) {
    Promise.resolve(requestHandler(req, res, next))
      .catch(function (err) {
      next(err);
    });
  };
};
