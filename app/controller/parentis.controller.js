const { genSaltSync, hashSync , compareSync} = require('bcrypt');
const{create,get,verifyotp,getUserByUserId} = require ('../../database/models/parentis.model')
const { sign } = require("jsonwebtoken");
const pool = require('../../database/db')

module.exports={ 
    createParent:(req,res)=>{
      const body = req.body;
      const salt = genSaltSync(10);
      body.password =hashSync(body.password, salt);
      get(body.email, (err, results) => {
        if(err){
          console.log(err)
        }
        if(results === undefined){
          create(body,(err , results)=>{
            if(err){
              console.log(err)
                return res.status(500).json({
                    apiStatus:false , message:"error adding parent"
                })
            }
            return res.status(200).json({
                 apiStatus:true, message:"student added successfuly"
            })
        })
        }else{
          return res.status(500).json({
            apiStatus:false , message:"Account already exists"
        }) 
        }
      })
   
  },
 
      verifyotp: (req, res) => {
        const body = req.body;
        verifyotp(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              apiStatus:false , message:"Not verified"

            })
          }
          return   res.json({
            apiStatus:true , message:"Verified successfully"
          })
        });
      },
      // getUserByUserId: (req, res) => {
      //   const id = req.params.id;
      //   getUserByUserId(id, (err, results) => {
      //     if (err) {
      //       console.log(err);
      //       return;
      //     }
      //     if (!results) {
      //       return res.status(500).json({
      //         apiStatus:false , message:"access failed"
      //       });
      //     }
      //     results.password = undefined;
      //     results.otp = undefined;
      //     results.status = undefined;
      //     results.active_devices= undefined
      //     return res.status(200).json({
      //       apiStatus:true , data:results, message:"succeeded"
          
      //     });
      //   });
      // }
      
}