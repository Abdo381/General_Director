const pool = require('../db')
const otpGen = require("../../app/helper/otp")
const mail = require('../../app/helper/email.helper')
const md5 = require('md5');
const otp = otpGen(6)
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey')
const newotp = md5(otp)
const date = require('date-and-time')
const now = new Date();
const value = date.format(now, 'YYYY-MM-DD');
const Genpassword = require("../../app/helper/password")

module.exports = {
  create: (data, callBack) => {
    const JWT =  Genpassword(6)
    const otp = otpGen(6)
    const  newotp = md5(otp)

    pool.query(
      `insert into students(First_Name,Last_Name,email,password,phone,otp,imge,JWT)
            values(?,?,?,?,?,?,?,?)`,
      [
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.phone,
        data.otp = newotp,
        data.imge = data.firstname.charAt(0) + data.lastname.charAt(0),
        data.JWT = JWT

        // mail( data.email, otp, "", "register")
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        console.log(otp)
        return callBack(null, results)
      }
    )
  },
  verifyotp: (data, email, callBack) => {
    const otp = md5(data.otp)
    pool.query(
      `select * from  students where otp = ? AND email = ?`,
      [
        otp,
        email,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  get: (email, callBack) => {
    pool.query(
      `  SELECT * FROM (SELECT email  FROM teachers UNION SELECT email  FROM students UNION SELECT email  FROM parentis ) AS U WHERE email = ? `,
      [email],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }

        return callBack(null, results[0]);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    pool.query(
      `select First_Name,Last_Name,email,imge,phone,type from students where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  Reservation: (teacher_id, student_id, group_id, time_join, callBack) => {
    pool.query(
      `insert into studentingroup(teacher_id, student_id, group_id,time_join)
                values(?,?,?,?)`,
      [
        teacher_id,
        student_id,
        group_id,
        time_join
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )
  },
  check: (teacher_id, student_id, group_id, callBack) => {
    pool.query(
      `  SELECT * FROM studentingroup where teacher_id = ? AND group_id  = ? AND student_id = ? `,
      [
        teacher_id,
        group_id,
        student_id
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }

        return callBack(null, results[0]);
      }
    );
  },
  ReservationOnline: (teacher_id, student_id, group_id, time_join, data, callBack) => {
    pool.query(
      `insert into studentingroup(teacher_id, student_id, group_id,time_join,image)
                  values(?,?,?,?,?)`,
      [
        teacher_id,
        student_id,
        group_id,
        time_join,
        data
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )
  },
  groupChate: (id, callBack) => {
    pool.query(`select * from studygroups,studentingroup,groupchat where groupchat.group_id = studentingroup.group_id and studentingroup.group_id = studygroups.id and studentingroup.student_id = ?`,
      [id], (error, results) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      })
  },
  getChat: (id, callBack) => {
    pool.query(`select * from groupchat where group_id = ?`,
      [id], (error, results) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      })
  },
  sendMessage: (data, callBack) => {
    group_id = cryptr.decrypt(data.group_id)
    teacher_id = cryptr.decrypt(data.teacher_id)

    pool.query(`insert into groupchat (group_id,teacher_id,message) values(?,?,?)`,
      [group_id, teacher_id, data.message], (error, results) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results)

      })
  },
  checkseen: (data, callBack) => {
    pool.query(`select * from seen where student_id = ? and group_id = ? and last_message = ? `, [data.student_id, data.group_id, data.last_message],
      (error, results) => {
        if (error) {
          return callBack(error)
        }

        return callBack(null, results[0])
      }
    )
  },
  checkGroupseen: (data, callBack) => {
    pool.query(`select * from seen where student_id = ? and group_id = ?`, [data.student_id, data.group_id, data.last_message],
      (error, results) => {
        if (error) {
          return callBack(error)
        }

        return callBack(null, results[0])
      }
    )
  },
  seen: (data, callBack) => {
    const student_id = data.student_id
    const group_id = data.group_id
    const last_message = data.last_message

    pool.query(`insert into seen (student_id,group_id,last_message) values(?,?,?)`,
      [student_id, group_id, last_message], (error, results) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results)

      })
  },
  checkunseen: (id, callBack) => {
    pool.query(`select * from seen where student_id = ?`, [id],
      (error, results) => {
        if (error) {
          return callBack(error)
        }

        return callBack(null, results)
      }
    )
  },
  checkupnseen: (data, callBack) => {
    pool.query(`select * from seen where student_id = ? and group_id =?`, [data.student_id, data.group_id],
      (error, results) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results[0])
      }
    )
  },
  updateMessage: (data, callBack) => {
    pool.query(`update seen set  last_message = ?  where student_id = ? and group_id = ?`, [data.last_message, data.student_id, data.group_id],
      (error, results) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results[0])
      }
    )
  },
  getMygroupsOnline: (id, callBack) => {
    pool.query(
      `  SELECT studygroups.id, studygroups.day ,studygroups.time ,teachers.firstname,teachers.lastname,teachers.Scientific_article  FROM studygroups,studentingroup,teachers where studentingroup.group_id = studygroups.id and studentingroup.teacher_id = teachers.id  and attendees = 'Online' and studentingroup.student_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }

        return callBack(null, results);
      }
    );
  },
  getGroupTutorials: (id, callBack) => {
    pool.query(
      ` SELECT file , time from pdf where group_id = ? `,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );
  },
  getInfoMygroupsOnline: (id, callBack) => {
    pool.query(
      `  SELECT studygroups.id, studygroups.day ,studygroups.time,teachers.firstname,teachers.lastname ,teachers.Scientific_article from studygroups,teachers where teachers.id = studygroups.teacher_id and studygroups.id = ? `,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }

        return callBack(null, results);
      }
    );
  },
  getVideosGroup: (id, callBack) => {
    pool.query(
      ` SELECT teacher_id ,id,video,time from videos where statusExam = '1' and group_id = ? `,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );
  },
  getDateVideo: (id, callBack) => {
    pool.query(
      ` SELECT time from videos where  id = ? `,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results[0]);
      }
    );
  },
  getExamVideo: (id, callBack) => {
    pool.query(
      ` SELECT * from examvideo where  video_id = ? `,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );
  },
  checkAttendees: (vidoe_id, student_id, callBack) => {
    pool.query(
      ` SELECT * from attendeesonline where  vidoe_id = ? and student_id = ? `,
      [
        vidoe_id,
        student_id
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results[0]);
      }
    );
  },
  attendeesonline: (teacher_id, group_id, student_id, vidoe_id, data, callBack) => {
    pool.query(
      `insert into attendeesonline(teacher_id,group_id,student_id,Attendees,date,vidoe_id)
      values(?,?,?,?,?,?)`,
      [
        teacher_id,
        group_id,
        student_id,
        data.Attendees,
        data.date,
        vidoe_id
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );
  },
  getExamsGroup: (id,time, callBack) => {
    pool.query(
      ` SELECT * from exam where start_date <= ? and expiry_date >= ? and  group_id = ?`,
      [
        time,
        time,
        id,

      ],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );
  },
  studentOpenExam: (teacher_id, student_id, group_id, exam_id , callBack) => {
    pool.query(
      `insert into students_open_exam(teacher_id,student_id,group_id,exam_id)
          values(?,?,?,?)`,
      [
        teacher_id,
        student_id,
        group_id,
        exam_id
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );

  },
  getQuizExam: ( id , callBack)  => {
    pool.query(
      ` SELECT * from exam_questions where  exam_id = ?`,
      [
        id,
      ],
      (error, results) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );
  },
  checkStudentShowQuizExam: ( teacher_id, student_id, group_id, exam_id , callBack)  => {
    pool.query(
      ` SELECT * from students_open_exam where  exam_id = ? and student_id = ? and group_id = ? and teacher_id = ? `,
      [
        exam_id,
        student_id,
        group_id,
        teacher_id
      ],
      (error, results) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results[0]);
      }
    );
  },

  note:(id ,time, callBack)=>{
    pool.query(
      ` SELECT studygroups.day,studygroups.time,exam.start_date,exam.expiry_date, exam.group_id , exam.id from exam,studentingroup,studygroups where studygroups.id = exam.group_id and  exam.group_id = studentingroup.group_id and start_date <= ? and expiry_date >= ? and  student_id  = ?`,
      [
        time,
        time,
        id,
      ],
      (error, results) => {
        if (error) {
          console.log(error)
        }
        if (Array.isArray(results)) {
          // removal by for loop
          let finalResults = [];
          const resultsLength = results.length;
          for (let index = 0; index < resultsLength; index++) {
              finalResults.push({...results[index]});
          }
          return callBack(null ,finalResults);
      }   
      }
    );
  },
  answerStudent:(data , callBack)=>{
      data.forEach(element => {
        pool.query( `insert into  hisanswer (exam_id,student_id,the_question,student_answer,The_correct_answer,score,quiz_id)
        values(?,?,?,?,?,?,?)`,
  [
   
    element.exam_id,
    element.student_id,
    element.the_question,
    element.student_answer,
    element.The_correct_answer,
    element.score,
    element.quiz_id
  ],
  (error, results, fields) => {
    if (error) {
      return callBack(error)
    }
  }
)
});
   return callBack(null );   
  },
  getMygroupsOffline: (id, callBack) => {
    pool.query(
      `  SELECT studygroups.id, studygroups.day ,studygroups.time ,teachers.firstname,teachers.lastname,teachers.Scientific_article  FROM studygroups,studentingroup,teachers where studentingroup.group_id = studygroups.id and studentingroup.teacher_id = teachers.id  and attendees = 'Offline' and studentingroup.student_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log(error)
        }

        return callBack(null, results);
      }
    );
  },
  checkStudentShowExam: (student_id , callBack)  => {
    pool.query(
      ` SELECT exam_id , group_id from students_open_exam where  student_id = ?`,
      [
        student_id
      ],
      (error, results) => {
        if (error) {
          console.log(error)
        }
        return callBack(null, results);
      }
    );
  },
  // checkdate:(exam_id , callBack)  => {
  //   pool.query(
  //     ` SELECT expiry_date , group_id from exam where  id = ?`,
  //     [
  //       student_id
  //     ],
  //     (error, results) => {
  //       if (error) {
  //         console.log(error)
  //       }
  //       return callBack(null, results);
  //     }
  //   );
  // },
  uplodeImage : ( student_id , image , callBack)=>{
    pool.query(
      `update students set  imge= ?  where id = ? `,
      [
        image,
        student_id

      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  getOldImage : ( teacher_id , callBack)=>{
    pool.query(
      `select imge from students where id = ? `,
      [
        teacher_id
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results[0]);
      }
    );
  },
  
  // exNoet:(id , callBack)=>{
  //   const exid = id.length
  //   var le = 0
    
  //   id.forEach(element => {
  //     pool.query(
  //       ` SELECT id from exam where  group_id  = ?`,
  //       [
  //         element.group_id,
  //       ],
  //       (error, results) => {
  //         if (error) {
  //           console.log(error)
  //         }
  //         if(le == exid){
  //           return callBack(null, results);
  //           // console.log(results)
  //         }
         
  //         // console.log(results)
  //         // exid.push(results)

  //       }
  //     );
  //     le++
  //     console.log(le)
  //   });
  //   // console.log(exid)

  // }

} 
