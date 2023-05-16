const { sign } = require("jsonwebtoken");
const pool = require('../../database/db')
const { compareSync,genSaltSync,hashSync} = require('bcrypt');
const{get} = require ('../../database/models/login.model')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey')
module.exports={
    login: (req, res ) => { 
      const salt = genSaltSync(10);
        const body = req.body;
        get(body.email, (err, results) => {
          if (err) {
            console.log(err);
          }
          if(results === undefined){
            return res.status(500).json({
             apiStatus:false , message:"Invalid email or password"
            }) 
          }else{
          if(results.status > 0){
            const result = compareSync(body.password, results.password);
            if (result) { 
              results.password = undefined;
              const token = sign(
                {id:results.id,type:results.type,JWT:results.JWT}, "qwe1234", {
                expiresIn: "1h"
              });
             
              results.id = cryptr.encrypt(results.id)
              return  res.json({
                apiStatus:true,
                date:{results,token},
                message:"login successfully"
              });
            } 
            else {
            
              return res.status(500).json({
                apiStatus:false,message:"Invalid email or password"
               
              });
            }
          }else{
            res.status(500).json({
              apiStatus:false ,data:results.type, message:"You must verify your account"
            })
          }
          }
        });
    
      },
}