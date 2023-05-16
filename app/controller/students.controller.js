const { genSaltSync, hashSync } = require('bcrypt');
const { create, get, verifyotp, sendMessage,exNoet,checkGroupseen,uplodeImage,getOldImage,answerStudent,checkStudentShowExam,getMygroupsOffline,checkStudentShowQuizExam,note,attendeesonline,getQuizExam,studentOpenExam,getExamsGroup,checkAttendees,getDateVideo,getExamVideo,getVideosGroup, updateMessage,getInfoMygroupsOnline,getGroupTutorials,getMygroupsOnline, checkunseen, checkupnseen, seen, checkseen, getChat, groupChate, getUserByUserId, Reservation, check, ReservationOnline } = require('../../database/models/students.model')
const pool = require('../../database/db')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey')
const fs = require('fs')

module.exports = {

  createStudent: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    get(body.email, (err, results) => {
      if (err) {
        console.log(err)
      }
      if (results === undefined) {
        create(body, (err, results) => {
          if (err) {
            return res.status(500).json({
              apiStatus: false, message: "error adding student"
            })
          }
          return res.status(200).json({
            apiStatus: true, message: "student added successfuly"
          })
        })
      } else {
        return res.status(500).json({
          apiStatus: false, message: "Account already exists"
        })
      }
    })

  },
  verifyotp: (req, res) => {
    const otp = req.body;
    const email = req.params.email
    verifyotp(otp, email, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          apiStatus: false, message: "Not verified"
        })
      }
      if (results !== undefined) {
        pool.query(`update students set  status=1  where id = ?`,
          [
            results.id
          ],

          (error) => {
            if (error) {
              return console.log(error);
            }
          });
        return res.json({
          apiStatus: true, message: "Verified successfully"
        })
      }
      if (results === undefined) {
        return res.status(500).json({
          apiStatus: true, message: "Code incorrect"
        })
      }

    });
  },
  getUserByUserId: (req, res) => {
    const iid = req.params.id;
    id = cryptr.decrypt(iid)
    getUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"

      });
    });
  },
  Reservation: (req, res) => {
    const teacher = req.params.teacher_id
    const studen = req.params.student_id
    const group = req.params.group_id
    const timejoin = req.params.time_join
    teacher_id = cryptr.decrypt(teacher)
    student_id = cryptr.decrypt(studen)
    group_id = cryptr.decrypt(group)
    check(teacher_id, student_id, group_id, (err, results) => {
      if (err) {
        // console.log(err)
      }
      if (results === undefined) {
        Reservation(teacher_id, student_id, group_id, timejoin, (err, results) => {
          if (err) {
            // console.log(err)
            return res.status(500).json({
              apiStatus: false, message: "error join Group"
            })
          }
          pool.query(`update studygroups set  joins= joins + 1  where id = ?`,
            [
              group_id
            ],

            (error) => {
              if (error) {
                return error;
              }
            });
          return res.status(200).json({
            apiStatus: true, message: "Join added successfuly"
          })
        })
      } else {
        return res.status(500).json({
          apiStatus: false, message: "You are already enrolled"
        })
      }
    })
  },
  ReservationOnline: (req, res) => {
    if (req.file === undefined) {
      return res.status(500).json({
        apiStatus: false, message: "no file upload"
      })
    }
    const data = `http://localhost:3000/${req.file.filename}`

    // console.log(req.file.filename)
    // const data = req.body
    const teacher = req.params.teacher_id
    const studen = req.params.student_id
    const group = req.params.group_id
    const timejoin = req.params.time_join
    teacher_id = cryptr.decrypt(teacher)
    student_id = cryptr.decrypt(studen)
    group_id = cryptr.decrypt(group)
    check(teacher_id, student_id, group_id, (err, results) => {
      if (err) {
        // console.log(err)
      }
      if (results === undefined) {
        ReservationOnline(teacher_id, student_id, group_id, timejoin, data, (err, results) => {
          if (err) {
            // console.log(err)
            return res.status(500).json({
              apiStatus: false, message: "error join Group"
            })
          }
          pool.query(`update studygroups set  joins= joins + 1  where id = ?`,
            [
              group_id
            ],

            (error) => {
              if (error) {
                return error;
              }
            });
          return res.status(200).json({
            apiStatus: true, message: "Join added successfuly"
          })
        })
      } else {
        return res.status(500).json({
          apiStatus: false, message: "You are already enrolled"
        })
      }
    })
  },
  groupChat: (req, res) => {
    const ids = req.body
    id = cryptr.decrypt(ids.id)
    groupChate(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      checkunseen(id, (err, resultsseen) => {
        if (err) {
          console.log(err)
        }
        results.sort(function (a, b) {
          return b.id - a.id
        })
        const seen = new Set();
        const newResults = results.filter(el => {
          const duplicate = seen.has(el.group_id);
          seen.add(el.group_id);
          return !duplicate;
        });

        newResults.forEach(element1 => {
          resultsseen.forEach(element2 => {
            if (element1.student_id == element2.student_id) {
              if (element1.group_id == element2.group_id) {
                if (element1.id == element2.last_message)
                  element1.status = 0
              }
            }
          });
        });
        
        results.forEach(function (value) {
          value.group_id = cryptr.encrypt(value.group_id)
          value.id = undefined
          value.teacher_id = undefined
          value.message = undefined
          value.student_id = undefined
          value.time_join = undefined
          value.maximum = undefined
          value.joins = undefined
          value.image = undefined
          value.Reservation = undefined
          value.Class_room = undefined

        });

        // console.log(newResults)
        // [resultsseen].forEach(function (element1)  {
        //   newResults.forEach(function (element2)  {
        //     if(element1.student_id === element2.student_id){
        //       element2.status===2
        //       console.log(newResults)
        //     } 
        //   });
        // });

        return res.status(200).json({
          apiStatus: true, data: newResults, message: "succeeded"

        });
      })

    });
  },
  message: (req, res) => {
    const body = req.body
    sendMessage(body, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      //   io.on('connection', (socket) => {
      //   socket.on('message', (message) => {
      //     console.log(message)
      //     io.emit('message', [message]);
      //   });
      //   socket.on('disconnect', () => {
      //   });
      // });
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"
      });
    })
  },
  getChat: (req, res) => {
    const ids = req.body
    id = cryptr.decrypt(ids.ids)
    getChat(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      // results.sort(function (a, b) {
      //   return (b.id) - (a.id)
      // })
      results.forEach(element => {
        element.group_id = undefined
        element.teacher_id = undefined
        element.id = cryptr.encrypt(element.id)
      });
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"
      });
    });
  },
  seen: (req, res) => {
    const body = req.body
    const student_id = cryptr.decrypt(body.student_id)
    const group_id = cryptr.decrypt(body.group_id)
    const last_message = cryptr.decrypt(body.last_message)
    data = {
      student_id: student_id,
      group_id: group_id,
      last_message: last_message}
      checkGroupseen(data, (err, results)=>{
        if (err) {
          console.log(err)
          return res.status(500).json({
            apiStatus: false, message: "failed"
          });
        }
        if( results == undefined ){
          pool.query(`insert into seen (student_id,group_id,last_message) values(?,?,?) `,[
            data.student_id , data.group_id , data.last_message
          ],
          (error) => {
            if (error) {
             console.log(error);
              return res.status(500).json({
                apiStatus: false, message: "failed"
              });
            }
          })
        }
      });
    checkseen(data, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
    
      if (results == undefined) {
        pool.query(`update seen set  last_message = ?  where student_id = ? and group_id = ?`,
        [
          data.last_message ,data.student_id, data.group_id
        ],

        (error) => {
          if (error) {
           console.log(error);
            return res.status(500).json({
              apiStatus: false, message: "failed"
            });
          }
        });
      }
      return res.status(200).json({
        apiStatus: true, message: "succeeded"
      });
      }
    )
  },
  getMygroupsOnline : (req, res) => {
    const student_id = cryptr.decrypt(req.body.student_id)
    getMygroupsOnline(student_id,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      results.forEach(element => {
        element.id = cryptr.encrypt (element.id)
      });
      return res.status(200).json({
        apiStatus: true,data:results, message: "succeeded"
      });
    }) 
 
  },
  getGroupTutorials : (req, res) => {
    const group_id = cryptr.decrypt(req.params.group_id)
    getGroupTutorials(group_id,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      getInfoMygroupsOnline(group_id,(err,resultss)=>{
        if (err){
          console.log(err)
          return res.status(500).json({
            apiStatus: false, message: "failed"
          });
        }
        return res.status(200).json({
          apiStatus: true,data:{results,resultss}, message: "succeeded"
        });
      })
 
    }) 
 
  },
  getVideosGroup : (req, res) => {
    const group_id = cryptr.decrypt(req.params.group_id)
    getVideosGroup(group_id,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      results.forEach(element => {
        element.id = cryptr.encrypt(element.id)
        element.teacher_id = cryptr.encrypt(element.teacher_id)

        
      });
      getInfoMygroupsOnline(group_id,(err,resultss)=>{
        if (err){
          console.log(err)
          return res.status(500).json({
            apiStatus: false, message: "failed"
          });
        }
        resultss.forEach(element => {
          element.id = cryptr.encrypt(element.id)
          
        });
        return res.status(200).json({
          apiStatus: true,data:{results,resultss}, message: "succeeded"
        });
      })
 
    }) 
 
  },
  getExamVideo : (req,res)=>{
    
    const video_id = cryptr.decrypt( req.body.video_id )
    const group_id = cryptr.decrypt( req.body.group_id )
    const student_id = cryptr.decrypt(req.body.student_id)
    const timeRegst = (req.body.today)
    checkAttendees(video_id ,student_id, (err ,Attendees)=>{
      if(err){
        console.log(err)
      }
   if(Attendees == undefined){
    getDateVideo(video_id , (err ,date)=>{
      if(err){
        console.log(err)
      }
      if (date.time == timeRegst){
          getExamVideo(video_id , (err ,results)=>{
        if(err){
          console.log(err)
        }
        return res.status(200).json({
          apiStatus: true,data:results, message: "succeeded"
        });
    })
      }else{
        return res.status(500).json({
          apiStatus: false, message: "Attendance is registration in the same day to  upload video only"
        });
      }
  
  })
   }else{
    return res.status(500).json({
      apiStatus: false, message: "You are already registered"
    });
   }
 
 
})
  },
   attendeesonline : (req, res) => {
    const data = req.body
    const student_id = cryptr.decrypt(req.body.student_id)
    const teacher_id = cryptr.decrypt(req.body.teacher_id)
    const group_id = cryptr.decrypt(req.body.group_id)
    const video_id = cryptr.decrypt(req.body.video_id)
    attendeesonline(teacher_id,group_id,student_id,video_id,data,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
    
      return res.status(200).json({
        apiStatus: true, message: "succeeded"
      });
    }) 
 
  },
  getExamsGroup : (req, res) => {
    const group_id = cryptr.decrypt(req.params.group_id)
    const time = req.body.date
    getExamsGroup(group_id,time,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      
      results.forEach(element => {
        element.id = cryptr.encrypt(element.id)
        element.teacher_id = cryptr.encrypt(element.teacher_id)
        element.group_id = cryptr.encrypt ( element.group_id)
      });
      getInfoMygroupsOnline(group_id,(err,resultss)=>{
        if (err){
          console.log(err)
          return res.status(500).json({
            apiStatus: false, message: "failed"
          });
        }
        resultss.forEach(element => {
          element.id = cryptr.encrypt(element.id)
          
        });
        return res.status(200).json({
          apiStatus: true,data:{resultss , results}, message: "succeeded"
        });
      })
 
    }) 
 
  },
  studentOpenExam: (req,res )=>{
   const teacher_id = cryptr.decrypt(req.body.teacher_id)
   const group_id = cryptr.decrypt ( req.body.group_id)
   const student_id = cryptr.decrypt ( req.body.student_id)
   const exam_id = cryptr.decrypt( req.body.exam_id)
  //  getQuizExam(exam_id , (err, results)=>{
  //   if(err){
  //     console.log(err)
  //   }
 
  //   return res.status(200).json({
  //     apiStatus: true,data: results, message: "succeeded"
  //   });
  // })
   checkStudentShowQuizExam (teacher_id, student_id, group_id, exam_id , (err,data)=>{
    if(err){
      console.log(err)
    }
    if(data == undefined){
      studentOpenExam(teacher_id, student_id , group_id , exam_id , (err)=>{
        if (err ){
         console.log(err)
         return res.status(500).json({
          apiStatus: false, message: "failed"
        });
        }else{
          getQuizExam(exam_id , (err, results)=>{
            if(err){
              console.log(err)
            }
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];

        // Swap
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
 shuffle(results)
 results.forEach(element => {
  element.id = cryptr.encrypt(element.id)
  element.exam_id = cryptr.encrypt ( element.exam_id)
 });
            return res.status(200).json({
              apiStatus: true,data: results, message: "succeeded"
            });
          })
        }
       })
    }else{
      return res.status(500).json({
        apiStatus: false, message: "You opened the test before"
      });
    }
   })

  },
  note :(req,res)=>{
    const student_id = cryptr.decrypt(req.body.student_id)
    const time = req.body.time
    note(student_id,time,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      checkStudentShowExam(student_id,(err,data)=>{
      const newResults = []
        results.forEach(element => {
            newResults.push(element)
          data.forEach(element2 => {
              if( element2.exam_id == element.id ){
                newResults.pop(element)
              }
          });
       });
   
       return res.status(200).json({
        apiStatus: true,data:newResults, message: "succeeded"
      });
    
    })


    }) 
  },
  answerStudent:(req,res)=>{
    const body = req.body
    body.forEach(element => {
      element.exam_id = cryptr.decrypt(element.exam_id)
      element.student_id = cryptr.decrypt(element.student_id)
      element.quiz_id = cryptr.decrypt( element.quiz_id)
    }); 
    answerStudent(body,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      return res.status(200).json({
        apiStatus: true, message: "succeeded"
      });
    }) 
  },
  getMygroupsOffline : (req, res) => {
    const student_id = cryptr.decrypt(req.body.student_id)
    getMygroupsOffline(student_id,(err,results)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      results.forEach(element => {
        element.id = cryptr.encrypt (element.id)
      });
      return res.status(200).json({
        apiStatus: true,data:results, message: "succeeded"
      });
    }) 
 
  },
  uplodeImage : (req , res)=>{
    const image = `http://localhost:3000/${req.file.filename}`
    const student_id = cryptr.decrypt(req.params.student_id)
    getOldImage ( student_id ,( err , resultsIamge)=>{
      if (err) {
        console.log(err)
      }
      if( resultsIamge.imge.length > 2){
        const clear = resultsIamge.imge.replace('http://localhost:3000/', 'uploads\\')
        fs.unlink(clear, function (err) { if (err) throw err; })
      }
      uplodeImage(student_id, image, (err, results) => {
        if (err) {
          console.log(err)
        }
        return res.status(200).json({
          apiStatus: true,data: image, message: "succeeded"
  
        });
      })
    })
   
  },
}

