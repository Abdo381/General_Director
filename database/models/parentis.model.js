const pool = require('../db')
const otpGen = require("../../app/helper/otp")
const mail = require('../../app/helper/email.helper')

module.exports = {
    create:(data , callBack)=>{
        const otp =otpGen(6)   
        pool.query(
          `insert into parentis(firstname,lastname,email,password,phone,otp)
          values(?,?,?,?,?,?)`,
            [
                data.firstname,
                data.lastname,
                data.email,
                data.password,
                data.phone,
                data.otp =otp,
                // mail( data.email, otp, "", "register")
            ],
            (error,results,fields)=>{
                if(error){
                 return callBack(error)
                }
                return callBack(null,results)
            }
        )
    },
    get:(email, callBack ) => {
      pool.query(
           `  SELECT * FROM (SELECT email  FROM teachers UNION SELECT email  FROM students UNION SELECT email  FROM parentis ) AS U WHERE email = ? `,
           [email],
           (error, results, fields) => {
             if (error) {
console.log(error)                }   
 
             return callBack(null, results[0]);
           }
         );
       }, 
      verifyotp:(data, callBack) => {
        pool.query(
          `update parentis set status=? where otp = ?`,
          [
            data.status=1,
            data.otp
          ],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results[0]);
          }
        );
      },
      // me:(data , callBack)={
      //   pool.query(
      //     `select * from parentis where id = ? `,[id],(error,data,fields)={
      //       if (error) {
      //         callBack(error);
              
      //       }
      //     }
      //   )
      // } 
      // getUserByUserId: (id, callBack) => {
      //   pool.query(
      //     `select * from parentis where id = ?`,
      //     [id],
      //     (error, results, fields) => {
      //       if (error) {
      //         callBack(error);
      //       }
      //       return callBack(null, results[0]);
      //     }
      //   );
      // },
      
}