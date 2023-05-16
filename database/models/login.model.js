const pool = require('../db')
module.exports={
    get:(email, callBack ) => {
        pool.query(
             `  SELECT *
             FROM (SELECT firstname,lastname, id, email , password ,status ,type,JWT FROM teachers
                   UNION
                   SELECT  First_Name,Last_Name, id,email , password,status,type,JWT FROM students
                   UNION SELECT firstname,lastname, id,email , password,status,type,JWT FROM parentis  ) AS U
            WHERE email = ? `,
             [email],
             (error, results, fields) => {
               if (error) {
console.log(error)                }   
   
               return callBack(null, results[0]);
             }
           );
         }, 
}