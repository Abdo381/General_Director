const multer = require("multer")
const path = require("path")
const fs = require("fs")
// const upload = multer({ dest: 'images/profile/' })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'uploads/')
    },
    filename: function (req, file, cb) {
      let originalname = file.originalname;
  
      let ext = originalname.split('.').pop();
      let filename = originalname.split('.').slice(0, -1).join('.');
  
      cb(null, filename + '-' + Date.now()+'.'+ext)
    } 
  })
  var upload = multer({ storage: storage })


module.exports = upload