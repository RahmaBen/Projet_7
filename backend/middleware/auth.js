// Required
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get Token Authorization
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.TOKEN_RANDOM);

    const userId = decodedToken.userId;

    // Verify if Token UserId = UserId
    if (!userId) {
      throw "Invalid userId";
    } else {
      req.userId = userId;
      next();
    }
  } catch {
    res.status(403).json({
      error: new Error(": Request unauthorized!"),
    });
    console.log("error");
  }
};
