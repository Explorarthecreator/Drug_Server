const { validationResult } = require("express-validator");
const { InvalidRequestError } = require("../errors/errors");

const validateRequest = (req, res, next) => {
  const error = validationResult(req);

  if (error.isEmpty()) {
    return next();
  }

  console.log("%o", error);
  throw new InvalidRequestError(error);
};

module.exports = { validateRequest };
