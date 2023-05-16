const jwt = require("jsonwebtoken");
const { getTeacherByid} = require('../database/models/teachers.model')

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
          console.log(err)  
          return res.status(500).json({
           apistatus:false, message: "Invalid Token..."
          });
        }
        if(decoded.type!=="teacher"){return res.status(401).json({apistatus:false, message: "Not authorized" })}
        const deco = decoded.id
        const decoJWT = decoded.JWT
        getTeacherByid(deco, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          if (results.JWT != decoJWT ) {
            return res.status(500).json({
              apiStatus: false, message: "Invalid Token..."
            });
          } else {
            

            req.decoded = decoded;
            next();
          }
        });
      });
    } else {
      return res.json({
       apistatus:false, message: "Access Denied! Unauthorized User"
      });
    }
  }
};