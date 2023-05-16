const pool = require('../db')
const otpGen = require("../../app/helper/otp")
const mail = require('../../app/helper/email.helper')
const md5 = require('md5');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey') 
const Genpassword = require("../../app/helper/password")
module.exports = {
  create: (data, callBack) => {
    const otp = otpGen(6)
    const JWT =  Genpassword(6)
    const  newotp = md5(otp)
    pool.query(
      `insert into teachers(firstname,lastname,email,password,otp,Governorate,Scientific_article,Educational_class,Reservation,image,JWT)
            values(?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.otp =newotp,
        data.Governorate,
        data.Scientific_article,
        data.Educational_class,
        data.Reservation,
        data.image = data.firstname.charAt(0) + data.lastname.charAt(0),
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
  getTeacherByid:(id , callBack)=>{
    pool.query(
      `select JWT from  teachers where id = ?`,
      [
        id
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  verifyotp:(data,email, callBack) => {
    const otp= md5( data.otp)
    pool.query(
      `select * from  teachers where otp = ? AND email = ?`,
      [
        otp,
        email
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
      `select firstname,lastname,email,image,type from teachers where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getAll: (callBack) => {
    pool.query(`select id , firstname, lastname, Governorate,Scientific_article,Scientific_article,Reservation,image from teachers`, (error, results) => {
      if (error) {
        callBack(error)
      }
      return callBack(null, results)
    })
  },
  createGroup: (id, data, callBack) => {
    pool.query(`insert into studygroups(teacher_id,day,time,maximum,Class_room,Reservation,attendees,gender_of_students)values(?,?,?,?,?,?,?,?)`, [
      id,
      data.day,
      data.time,
      data.maximum,
      data.Class_room,
      data.Reservation,
      data.attendees,
      data.gender_of_students
    ], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results)
    }
    )
  },
  getAllgroup: (id, callBack) => {
    pool.query(`select * from studygroups where teacher_id =?`, [id], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results)
    })

  },
  getAllgroup2: (id, callBack) => {
    pool.query(`select * from studygroups where attendees	= "Offline" and teacher_id =?`, [id], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results)
    })

  },
  getGroupById: (id, tid, callBack) => {
    pool.query(`select * from studygroups where id = ? AND teacher_id = ?`, [id, tid], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results)
    })
  },
  getGroupPDFById: (id, tid, callBack) => {
    pool.query(`select * from pdf where group_id = ? AND teacher_id = ?`, [id, tid], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results)
    })
  },
   getStudentGroupById: (id,callBack) => {
    pool.query(`select * from students , studentingroup where  students.id = studentingroup.student_id  AND  group_id = ? `, [id], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results) 
    })
  }, 
  deleteGroup: (id, callBack) => {
    pool.query(
      `delete from studygroups where id = ? `,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getTeacherById: (id,callBack) => {
    pool.query(`select * from teachers where id = ? `, [id], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results) 
    })
  },
  getLocation : (id,callBack)=>{
    pool.query(`select latitude,longitude from locations where teacher_id = ? `, [id], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results) 
    })
  },
  getGroupsTeacherById: (id, callBack) => {
    pool.query(`select * from studygroups where joins < maximum AND teacher_id = ?`, [id,],(error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results)
    })
  },
  checkAttendees:(data,callBack)=>{
    const teacher_id = cryptr.decrypt(data.teacher_id)
    const group_id = cryptr.decrypt(data.group_id)
    const student_id = cryptr.decrypt(data.student_id)
    pool.query(
      `select* from attendees where teacher_id=? AND group_id = ? AND student_id=? AND date = ?  `,
      [
        teacher_id,
        group_id,
        student_id,
        data.date
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results[0])
      }
    )
  },
  Attendees: (data, callBack) => {
    const teacher_id = cryptr.decrypt(data.teacher_id)
    const group_id = cryptr.decrypt(data.group_id)
    const student_id = cryptr.decrypt(data.student_id)
    pool.query(
      `insert into attendees(teacher_id, group_id,student_id , name, Attendees,date)
            values(?,?,?,?,?,?)`,
      [
        teacher_id,
        group_id,
        student_id,
        data.name, 
        data.Attendees,
        data.date
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )
  },
  Attendeesdate: (group_id, callBack) => {
    pool.query(
      `select DISTINCT  date from attendees where  group_id =?`,
      [
        group_id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
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
    )
  },
AttendeesStatus: (group_id,student_id, callBack) => {
    pool.query(
      `select Attendees,id from attendees where student_id=? and  group_id =?`,
      [
        student_id,
        group_id,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )
  },
  AttendeesName: (group_id,student_id, callBack) => {
    pool.query(
      `select DISTINCT name from attendees where student_id=? and  group_id =?`,
      [
        student_id,
        group_id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )
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
  deleteStudent : ( id , gid, callBack)=>{
    pool.query(
      `delete from studentingroup where student_id = ? and group_id = ? `,
      [
        id,
        gid
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getImage : ( id ,gId, callBack)=>{
    pool.query(
      `select image from studentingroup where student_id = ? and group_id = ?`,
      [
        id,
        gId
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateGroup : ( data ,id , teacher_id , callBack)=>{
    pool.query(
      `update studygroups set  day= ? , time = ? , maximum = ? ,Class_room=?,Reservation = ? ,attendees=? ,gender_of_students=?  where id = ? and teacher_id = ?`,
      [
        data.day,
        data.time,
        data.maximum,
        data.Class_room,
        data.Reservation,
        data.attendees,
        data.gender_of_students,
        id,
        teacher_id,
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  removTo :(id ,idg, callBack)=>{
    pool.query(
      `update studentingroup set  group_id = ? where id = ?`,
      [id,idg],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  upstudentGroup :(id , callBack)=>{
    pool.query(
      `update studygroups set  joins= joins + 1  where id = ?`,
      [id],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  upstudentGroupp :(id , callBack)=>{
    pool.query(
      `update studygroups set  joins= joins - 1  where id = ?`,
      [id],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getGroupOnline : ( id , callBack)=>{
    pool.query(
      `select * from studygroups where attendees = 'Online' and teacher_id = ? `,
      [id],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  addVideo : ( teacher_id,group_id,video,time,callBack)=>{
    pool.query(
      `insert into  videos(teacher_id, group_id,time,video 	)
      values(?,?,?,?)`,
      [
        teacher_id,
      group_id,
      time,
    video,
  ],
      (error, results,) => {
        if (error) {
          console.log(error);
        }
        return callBack(null, results);
      }
    );
  },
  getGroupvideo : ( id ,tid, callBack)=>{
    pool.query(
      `select * from videos where group_id = ? and teacher_id = ? `,
      [id,tid],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  addExam : ( data , callBack)=>{
    data.forEach(element => {
      pool.query(
        `insert into examvideo(video_id,Question,choice1,choice2,choice3,choice4,answer)
              values(?,?,?,?,?,?,?)`,
        [
        
          element.video_id,
          element.Question,
          element.choice1,
          element.choice2,
          element.choice3,
          element.choice4,
          element.answer
        ],
        (error, results) => {
          if (error) {
            return callBack(error)
          }
        }
      )
});
return callBack(null)
  },
  info : ( id , callBack)=>{
    pool.query(
      `select * from studentingroup where teacher_id = ? `,
      [id,tid],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  exam: (teacher_id,group_id, data, callBack) => {
    pool.query(
      `insert into exam(teacher_id,group_id,start_date,expiry_date,endexam,Notes,timestamp)
            values(?,?,?,?,?,?,?)`,
      [
        teacher_id,
        group_id,
        data.start_date,
        data.expiry_date,
        data.endexam,
        data.Notes,
        data.timestamp
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, results)
      }
    )
  },
  getIdExam: (teacher_id,group_id, data,callBack) => {
    pool.query(`select id from exam where teacher_id = ? and group_id =? and start_date = ? and expiry_date =? and endexam = ? and Notes = ? and timestamp =? `, 
    [
      teacher_id,
      group_id,
      data.start_date,
      data.expiry_date,
      data.endexam,
      data.Notes,
      data.timestamp
    ], (error, results) => {
      if (error) {
        return callBack(error)
      }
      return callBack(null, results) 
    })
  },
  examQuestions: (data, callBack) => {
    data.forEach(element => {
    pool.query(
      `insert into exam_questions(Question,Question_score,choice1,choice2,choice3,choice4,answerQ,exam_id)
            values(?,?,?,?,?,?,?,?)`,
      [
       
        element.Question,
        element.Question_score,
        element.choice1,
        element.choice2,
        element.choice3,
        element.choice4,
        element.answerQ,
        element.exam_id,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error)
        }
      }
    )
  });
  },
  addLocation:(teacher_id,data , callBack)=>{
    pool.query(
      `insert into  locations(teacher_id,latitude,longitude)
      values(?,?,?)`,
      [
        teacher_id,
        data.latitude,
        data.longitude
  ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  checkLocation:( id , callBack)=>{
    pool.query(
      `select * from locations where teacher_id = ? `,
      [id],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  addPdf : ( teacher_id,group_id,PDF,time, callBack)=>{
    pool.query(
      `insert into  PDF(teacher_id, group_id,time,file)
      values(?,?,?,?)`,
      [
        teacher_id,
      group_id,
      time,
    PDF
  ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getImageRes: ( id , callBack)=>{
    pool.query(
      `select image from studentingroup where group_id = ?`,
      [
        id,
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getAllVideoToremove:( id , callBack)=>{
    pool.query(
      `select video from videos where group_id = ?`,
      [
        id,
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getVideo:( id , callBack)=>{
    pool.query(
      `select video from videos where id = ?`,
      [
        id,
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );

  },
  deleteVideo:( id , callBack)=>{
    pool.query(
      `delete from  videos where id = ?`,
      [
        id,
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );

  },
  getGroupExam : ( id ,tid, callBack)=>{
    pool.query(
      `select * from exam where group_id = ? and teacher_id = ? `,
      [id,tid],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getGroupExamQuiz : ( id , callBack)=>{
    pool.query(
      `select * from exam_questions where exam_id = ? `,
      [id],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
   getAnsare : ( exame_id ,student_id , callBack)=>{
    pool.query(
      `select * from hisanswer where student_id =? and exam_id = ? `,
      [
        student_id,
        exame_id

      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  getStudentDidntOpenExam : ( group_id, callBack)=>{
    pool.query(
      `select * from studentingroup,students where students.id = studentingroup.student_id and  group_id = ? `,
      [
        group_id
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  getStudentOpenExam : ( id , callBack)=>{
    pool.query(
      `select * from students_open_exam,students where students.id = students_open_exam.student_id and  exam_id = ? `,
      [id],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  getStudentOpenExamScore : ( exam_id , callBack)=>{
    pool.query(
      `select student_id , score from hisanswer where exam_id = ? `,
      [
        exam_id
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  uplodeImage : ( teacher_id , image , callBack)=>{
    pool.query(
      `update teachers set  image= ?  where id = ? `,
      [
        image,
        teacher_id

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
      `select image from teachers where id = ? `,
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
  getprofile : ( teacher_id , callBack)=>{
    pool.query(
      `select * from teachers where id = ? `,
      [
        teacher_id
      ],
      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  updateEmail : (data, callBack)=>{
    const otp = otpGen(6)
    const  newotp = md5(otp)
    pool.query(
      `update teachers set  email = ? , status = 0 , otp = ?   where email = ?`,
      [
        data.newemail,
        data.otp = newotp,
        data.oldemail
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
        console.log(otp)
          return callBack(null, results);
      }
    );
  },
  updateGovernorate : (data, callBack)=>{
    pool.query(
      `update teachers set  Governorate = ? where email = ?`,
      [
        data.Governorate,
        data.email
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  updateScientific_article : (data, callBack)=>{
    pool.query(
      `update teachers set  Scientific_article = ? where email = ?`,
      [
        data.Scientific_article,
        data.email
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  updateEducational_class : (data, callBack)=>{
    pool.query(
      `update teachers set  Educational_class = ? where email = ?`,
      [
        data.Educational_class,
        data.email
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  updateReservation : (data, callBack)=>{
    pool.query(
      `update teachers set  Reservation = ? where email = ?`,
      [
        data.Reservation,
        data.email
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  resetPassword : ( data , callBack)=>{
    pool.query(
      `update teachers set  password = ? where email = ?`,
      [
        data.newpassword,
        data.email,
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  },
  logout :(data , callBack)=>{
    const JWT =  Genpassword(6)
    pool.query(
      `update teachers set  JWT = ? where email = ?`,
      [
        JWT,
        data.email,
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
          results.JWT = JWT
          return callBack(null, results);
      }
    );
  },
  forgotPassword : (data, callBack)=>{
    const otp = otpGen(6)
    const  newotp = md5(otp)
    pool.query(
      `update teachers set 	otp = ? where email = ?`,
      [
        data.otp = newotp,
        data.email,
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
        console.log(otp)

          return callBack(null, results);
      }
    );
  } ,
  newPassword : ( data ,password,callBack)=>{
    if(data.otp == null){
     data.otp =0
    }
    const  newotp = md5(data.otp)

    pool.query(
      `update teachers set 	password = ? where otp = ?`,
      [
        password,
        newotp,
      ],

      (error, results,) => {
        if (error) {
          callBack(error);
        }
          return callBack(null, results);
      }
    );
  }
} 
// class teachers{
//   static  getAllgroup =async(res , req)=>{

//   }
// }