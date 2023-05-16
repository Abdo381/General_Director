const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.json({
           apistatus:false, message: "Invalid Token..."
          });
        }if(decoded.type!=="parent"){
            return res.status(401).json({apistatus:false, message: "Not authorized" })
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
       apistatus:false, message: "Access Denied! Unauthorized User"
      });
    }
  }
};