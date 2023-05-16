const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    const token = req.header("Authorization").replace('Bearer ', "")
    if(token == null){
      return res.status(401).json({
        apistatus:false, message: "No token in header"
      })
    }
    if (token) {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.status(500).json({
           apistatus:false, message: "Invalid Token..."
          });
        }if(decoded.type!=="student"){
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