const jwt = require("jsonwebtoken");

const tokenHandler = async (req, res, next) => {
  const token = req.body.token || req.cookies || req.headers["x-auth-token"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, msg: "A token is required " });
  }
  try {
    const decoded = jwt.verify(token, "supersecretpassword");

    req.user = decoded.user;
    return next();
  } catch (error) {
    return res.status(400).send("Invalid Token");
  }
}


module.exports = tokenHandler;
