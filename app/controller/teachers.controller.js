// const { ,genSaltSync, hashSync } = require('bcrypt');
const { sign } = require("jsonwebtoken");
const { create, get, Attendeesdate,updateReservation,logout,newPassword,forgotPassword,resetPassword, getLocation,getAnsare,updateEducational_class,updateScientific_article,updateGovernorate,updateEmail,getprofile,getOldImage,uplodeImage,getStudentDidntOpenExam,getStudentOpenExam,getStudentOpenExamScore, getAllVideoToremove,getGroupExamQuiz,getGroupExam,getVideo,deleteVideo,getGroupPDFById, addPdf, getImageRes, getImage, exam, checkLocation, addLocation, getIdExam, examQuestions, getGroupvideo, getAllgroup2, getGroupOnline, addVideo, removTo, upstudentGroupp, upstudentGroup, AttendeesStatus, deleteStudent, updateGroup, Attendees, getChat, AttendeesName, checkAttendees, verifyotp, getUserByUserId, getGroupsTeacherById, getAll, createGroup, getAllgroup, getStudentGroupById, getGroupById, deleteGroup, getTeacherById, addExam } = require('../../database/models/teachers.model')
const login = require ('../../database/models/login.model')
const pool = require('../../database/db')
const fs = require('fs')
var publicDir = require('path').join(__dirname, '/uploads');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey')
var QRCode = require('qrcode')
const Genpassword = require("../../app/helper/password")
const { compareSync,genSaltSync,hashSync} = require('bcrypt');

module.exports = {
  createTeacher: (req, res) => {
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
              apiStatus: false, message: "error adding Teacher"
            })
          }
          return res.status(200).json({
            apiStatus: true, message: "Teacher added successfuly"
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
    const body = req.body;
    const email = req.params.email
    verifyotp(body, email, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          apiStatus: false, message: "Not verified"
        })
      }
      if (results !== undefined) {
        pool.query(`update teachers set  status=1  where id = ?`,
          [
            results.id
          ],

          (error) => {
            if (error) {
              return console.log(error);
            }
          });
          const idCrypt = cryptr.encrypt(results.id)
          const path = "./QrCodeImages";
          fs.access(path, (error) => {
            if (error) {
              fs.mkdir(path, { recursive: true }, (error) => {
                if (error) {
                  console.log(error);
                } else {
                  QRCode.toFile(`QrCodeImages/${results.id}.png`,`http://localhost:4200/Teacher%20Details/${idCrypt}`)
                  return ;
                }
              });
            } else {
              QRCode.toFile(`QrCodeImages/${results.id}.png`,`http://localhost:4200/Teacher%20Details/${idCrypt}`)
              return;
            }
          })
          
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
  getAll: (req, res) => {
    getAll((err, results) => {
      if (err) {
        console.log(err)
        return;
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      results.forEach(function (value) {
        value.id = cryptr.encrypt(value.id)
      });
      // console.log(id)
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"

      });
    })
  },
  AddGroup: (req, res) => {
    const body = req.body;
    const iid = req.params.id;
    id = cryptr.decrypt(iid)
    createGroup(id, body, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "error adding Group"
        })
      }
      return res.status(200).json({
        apiStatus: true, message: "Group added successfuly"
      })
    })
  },
  getAllgroup: (req, res) => {
    const iid = req.params.id;
    id = cryptr.decrypt(iid)
    getAllgroup(id, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      results.forEach(function (value) {
        value.id = cryptr.encrypt(value.id)
        value.teacher_id = undefined
      });
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"

      });
    })
  },
  getGroupById: (req, res) => {
    const idg = req.params.id
    id = cryptr.decrypt(idg)
    const iid = req.params.tid;
    tid = cryptr.decrypt(iid)
    getGroupById(id, tid, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      getStudentGroupById(id, (err, resultss) => {
        if (err) {
          return
        }
        results.forEach(function (value) {
          value.id = cryptr.encrypt(value.id)
          value.teacher_id = cryptr.encrypt(value.teacher_id)

        });
        resultss.forEach(function (value) {
          value.id = cryptr.encrypt(value.id)
          value.teacher_id = cryptr.encrypt(value.teacher_id)
          value.student_id = cryptr.encrypt(value.student_id)
          value.group_id = cryptr.encrypt(value.group_id)
          value.password = undefined
          value.status = undefined
          value.otp = undefined
          value.type = undefined
          value.active_devices = undefined
          value.email = undefined
          value.imge = undefined


        });

        return res.status(200).json({
          apiStatus: true, data: { results, resultss }, message: "succeeded"

        });
      })
    })
  },
  deleteGroup: (req, res) => {
    const iid = req.params.id;
    data = cryptr.decrypt(iid)
    getAllVideoToremove(data, (err, vid) => {
      getImageRes(data, (err, ress) => {

        deleteGroup(data, (err, results) => {
          if (err) {
            return res.status(500).json({
              apiStatus: false, message: "access failed"
            });
          }
          ress.forEach(element => {
            const el = element.image.replace('http://localhost:3000/', 'uploads\\')
            fs.unlink(el, function (err) { if (err) console.log(err); })
          });
          vid.forEach(element => {
            const vd = element.video.replace('http://localhost:3000/', 'uploads\\')
            fs.unlink(vd, function (err) { if (err) console.log(err); })

          });
          return res.status(200).json({
            apiStatus: true, message: "succeeded"

          });
        })

      });
    })
  },
  getTeacherById: (req, res) => {
    const iid = req.params.id;
    id = cryptr.decrypt(iid)
    getTeacherById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results.length == 0) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      getLocation(id, (err, resultss) => {
        if (err) {
          console.log(err);
          return;
        }
        results.forEach(function (value) {
          value.id = cryptr.encrypt(value.id)
          value.email = undefined
          value.otp = undefined
          value.password = undefined
          value.status = undefined
          value.type = undefined
          value.active_devices = undefined
          value.teacher_id = undefined
        });
        return res.status(200).json({
          apiStatus: true, data: { results, resultss }, message: "succeeded"

        });
      })

    });
  },
  getGroupsTeacherById: (req, res) => {
    const iid = req.params.id;
    id = cryptr.decrypt(iid)
    getGroupsTeacherById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      results.forEach(function (value) {
        value.id = cryptr.encrypt(value.id)
        value.teacher_id = cryptr.encrypt(value.teacher_id)
        // console.log(value.id,value.teacher_id)

      });
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"

      });
    });
  },
  Attendees: (req, res) => {
    const body = req.body;
    checkAttendees(body, (err, results) => {
      if (err) {
        console.log(err)
      }
      if (results === undefined) {
        Attendees(body, (err, results) => {
          if (err) {
            console.log(err)
            return res.status(500).json({
              apiStatus: false, message: "error"
            })
          }
          return res.status(200).json({
            apiStatus: true, message: "successfuly"
          })
        })
      } else {
        return res.status(500).json({
          apiStatus: false, message: "Of course,  was registered today"
        })
      }
    })

  },
  AttendeesDetails: (req, res) => {
    const id = req.params.id
    const ids = req.params.ids
    student_id = cryptr.decrypt(ids)
    group_id = cryptr.decrypt(id)
    AttendeesName(group_id, student_id, (err, resultsname) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "error"
        })
      }
      Attendeesdate(group_id, (err, resultsdate) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            apiStatus: false, message: "error"
          })
        }
        resultsdate.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })
        AttendeesStatus(group_id, student_id, (err, resultsstatus) => {
          if (err) {
            console.log(err)
            return res.status(500).json({
              apiStatus: false, message: "error"
            })
          }

          resultsstatus.sort((a, b) => {
            return b.id - a.id
          })
          resultsstatus.forEach(function (value) {
            value.id = undefined

          });
          return res.status(200).json({
            apiStatus: true, data: { resultsname, resultsdate, resultsstatus }, message: "successfuly"
          })


        })
      })
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
      results.sort(function (a, b) {
        return (b.id) - (a.id)
      })
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
  deleteStudent: (req, res) => {
    const iid = cryptr.decrypt(req.params.id)
    const gId = cryptr.decrypt(req.params.group_id)
    getImage(iid, gId, (err, img) => {

      deleteStudent(iid, gId, (err, results) => {
        if (err) {
        }
        if (err) {
          return res.status(500).json({
            apiStatus: false, message: "access failed"
          });
        }
        pool.query(`update studygroups set  joins= joins - 1  where id = ?`,
          [
            gId
          ],

          (error) => {
            if (error) {
              return error;
            }
          });
      });
      const clear = img.image.replace('http://localhost:3000/', 'uploads\\')
      fs.unlink(clear, function (err) { if (err) console.log(err) })

    });
    return res.status(200).json({
      apiStatus: true, message: "succeeded"
    });
  },
  updateGroup: (req, res) => {
    const body = req.body
    id = cryptr.decrypt(body.id)
    teacher_id = cryptr.decrypt(body.teacher_id)
    updateGroup(body, id, teacher_id, (err, results) => {
      if (err) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      return res.status(200).json({
        apiStatus: true, message: "succeeded"

      });
    });
  },
  removeTo: (req, res) => {
    const body = req.body
    id = cryptr.decrypt(body.id)
    idg = cryptr.decrypt(body.idg)
    gid = cryptr.decrypt(body.gid)
    removTo(id, idg, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      upstudentGroup(id, (err, results) => {
        if (err) {
          console.log(err)
        }
        upstudentGroupp(gid, (err, results) => {
          if (err) {
            console.log(err)
          }
        });
      });

      return res.status(200).json({
        apiStatus: true, message: "succes"
      });
    });
  },
  getGroupOnline: (req, res) => {
    const id = cryptr.decrypt(req.body.id)
    getGroupOnline(id, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      results.forEach(function (value) {
        value.id = cryptr.encrypt(value.id)
        value.teacher_id = undefined
      });
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"

      });
    })

  },
  getGroupByIdO: (req, res) => {
    const idg = req.params.id
    id = cryptr.decrypt(idg)
    const iid = req.params.tid;
    tid = cryptr.decrypt(iid)
    getGroupById(id, tid, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      getGroupvideo(id, tid, (err, resultss) => {
        if (err) {
          return
        }
        if (!results) {
          return res.status(500).json({
            apiStatus: false, message: "access failed"
          });
        }
        results.forEach(element => {
          element.id = cryptr.encrypt(element.id)
        });
        resultss.forEach(element => {
          element.id = cryptr.encrypt(element.id)
        });
        return res.status(200).json({
          apiStatus: true, data: { results, resultss }, message: "succeeded"
        });

      })
    })
  },
  addVideo: (req, res) => {
    const video = `http://localhost:3000/${req.file.filename}`
    const group_id = cryptr.decrypt(req.params.group_id)
    const teacher_id = cryptr.decrypt(req.params.teacher_id)
    const time = req.params.time
    addVideo(teacher_id, group_id, video, time, (err, results) => {
      if (err) {
        console.log(err)
      }
  
      return res.status(200).json({
        apiStatus: true, message: "succeeded"

      });
    })


  },
  addExam: (req, res) => {
    const body = req.body
    const err = []
    // body.forEach(element => {
    //   console.log(element)
    // });
    if (body.length <= 0) {
      return res.status(500).json({
        apiStatus: false, message: "There are empty values. This is forbidden"
      }); 
    }
    body.forEach(element => {
      if (element.video_id === '') {
        err.push('err')
      } else if (element.Question === '') {
        err.push('err')

      } else if (element.choice1 === '') {
        err.push('err')

      } else if (element.choice2 === '') {
        err.push('err')

      } else if (element.choice3 === '') {
        err.push('err')
      } else if (element.choice4 === '') {
        err.push('err')

      } else if (element.answer === '') {
        err.push('err')
      }
      element.video_id = cryptr.decrypt(element.video_id)
    });
    if (err.length > 0) {
      return res.status(500).json({
        apiStatus: false, message: "There are empty values. This is forbidden"

      });
    }
    addExam(body, (err, results) => {
      if (err) {
        console.log(err)
      }
      return res.status(200).json({
        apiStatus: true, message: "succeeded"

      });
    }) 

  },
  getAllgroup2: (req, res) => {
    const iid = req.params.id;
    id = cryptr.decrypt(iid)
    getAllgroup2(id, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      results.forEach(function (value) {
        value.id = cryptr.encrypt(value.id)
        value.teacher_id = undefined
      });
      return res.status(200).json({
        apiStatus: true, data: results, message: "succeeded"

      });
    })
  },
  exam: (req, res) => {
    const group_id = cryptr.decrypt(req.body.group_id)
    const teacher_id = cryptr.decrypt(req.body.teacher_id)
    const data = req.body
    exam(teacher_id, group_id, data, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }
      getIdExam(teacher_id, group_id, data, (err, results) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            apiStatus: false, message: "failed"

          });
        }
        results.forEach(element => {
          element.id = cryptr.encrypt(element.id)

        });
        return res.status(200).json({
          apiStatus: true, data: results, message: "succeeded"

        });
      })

    })


  },
  examQuestions: (req, res) => {
    const data = req.body
    data.forEach(element => {
      element.exam_id = cryptr.decrypt(element.exam_id)
    });
    examQuestions(data, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          apiStatus: false, message: "failed"
        });
      }

    })
    return res.status(200).json({
      apiStatus: true, message: "succeeded"

    });
  },
  addLocation: (req, res) => {
    const teacher_id = cryptr.decrypt(req.body.teacher_id)
    const data = req.body
    checkLocation(teacher_id, (err, loc) => {
      if (err) {
        console.log(err)
      }
      if (loc == undefined) {
        addLocation(teacher_id, data, (err, results) => {
          if (err) {
            console.log(err)
            return res.status(500).json({
              apiStatus: false, message: "failed"
            });
          }
          return res.status(200).json({
            apiStatus: true, message: "succeeded"
          });
        })
      }
    })
  },
  getGroupByIdPdf: (req, res) => {
    const idg = req.params.id
    id = cryptr.decrypt(idg)
    const iid = req.params.tid;
    tid = cryptr.decrypt(iid)
    getGroupById(id, tid, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      results.forEach(element => {
        element.id = cryptr.encrypt(element.id)
      });
      getGroupPDFById(id, tid, (err, resultss) => {
        if (err) {
          return
        }
        return res.status(200).json({
          apiStatus: true, data:{results,resultss}, message: "succeeded"
        });
    })
  })
  },
  addPdf: (req, res) => {
    const PDF = `http://localhost:3000/${req.file.filename}`
    const group_id = cryptr.decrypt(req.params.group_id)
    const teacher_id = cryptr.decrypt(req.params.teacher_id)
    const time = req.params.time
    addPdf(teacher_id, group_id, PDF, time, (err, results) => {
      if (err) {
        console.log(err)
      }
      return res.status(200).json({
        apiStatus: true, message: "succeeded"

      });
    })


  },
  deleteVideo:(req , res)=>{
const id = cryptr.decrypt(req.params.id)
getVideo (id,(err,video)=>{
  if(err){
    console.log(err)
  }
  const clear = video.video.replace('http://localhost:3000/','uploads\\')
  fs.unlink(clear, function (err) { if (err) throw err; })
  deleteVideo(id,(err,results)=>{
    if(err){
      console.log(err)
    }
    return res.status(200).json({
      apiStatus: true, message: "succeeded"
    });
  })
})
  },
  getGroupByIdExam: (req, res) => {
    const idg = req.params.id
    id = cryptr.decrypt(idg)
    const iid = req.params.tid;
    tid = cryptr.decrypt(iid)
    getGroupById(id, tid, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.status(500).json({
          apiStatus: false, message: "access failed"
        });
      }
      getGroupExam(id, tid, (err, resultss) => {
        if (err) {
          return
        }
        if (!results) {
          return res.status(500).json({
            apiStatus: false, message: "access failed"
          });
        }
        results.forEach(element => {
          element.id = cryptr.encrypt(element.id)
        });
        resultss.forEach(element => {
          element.id = cryptr.encrypt(element.id)
        });
        return res.status(200).json({
          apiStatus: true, data: { results, resultss }, message: "succeeded"
        });

      })
    })
  },
  getGroupExamQuiz: (req, res) => {
    const exam_id = cryptr.decrypt(req.body.id)
    getGroupExamQuiz(exam_id,(err, results) => {
      if (err) {
        return
      }
      return res.status(200).json({
        apiStatus: true, data:  results, message: "succeeded"
      });
    })
  },
  getStudentOpenExam : (req, res) => {
    const exam_id = cryptr.decrypt(req.body.id)
    getStudentOpenExam(exam_id,(err, results) => {
      if (err) {
        return
      }
      results.forEach(element => {
        element.score = []
        element.email = undefined
        element.group_id = undefined
        element.id = undefined
        element.otp = undefined
        element.password = undefined
        element.status = undefined
        // element.student_id = undefined
        element.teacher_id = undefined
        element.type = undefined
        element.exam_id = cryptr.encrypt(element.exam_id)
      });
         getStudentOpenExamScore ( exam_id , (err,scor)=>{
          if(err){
            console.log(err)
          }
          scor.forEach(element => {
            results.forEach(element2 => {
              
              if( element.student_id === element2.student_id){
                
                element.student_id = undefined
                element2.score.push(element.score)
              }
            });
          });
          results.forEach(element => {
            element.score = element.score.reduce((a, b) => a + b, 0)
            element.student_id = cryptr.encrypt(element.student_id)
      
          });
          return res.status(200).json({
            apiStatus: true, data:  results, message: "succeeded"
          });
         })
    })
  },
  getStudentDidntOpenExam:(req,res)=>{
    const exam_id = cryptr.decrypt(req.body.exam_id)
    const group_id = cryptr.decrypt(req.body.group_id)
    getStudentOpenExam(exam_id,(err, results) => {
      if (err) {
        return
      }
      getStudentDidntOpenExam(group_id,(err, results2) => {
        if (err) {return}
        const newResult = []
        results2.forEach(element2 => {
        results.forEach(element => {
          if(element2.student_id != element.student_id ){
            newResult.push(element2)
          }
        });   
        });
        newResult.forEach(element => {
          element.id = undefined
          element.teacher_id = undefined
          element.student_id = undefined
          element.group_id = undefined
          element.time_join = undefined
          element.email = undefined
          element.password = undefined
          element.otp = undefined
          element.status = undefined
          element.type = undefined
          element.image = undefined
        });
        return res.status(200).json({
          apiStatus: true, data:  newResult, message: "succeeded"
        });
      })
    })
  },
  getAnsare : (req , res)=>{
    const exam_id = cryptr.decrypt(req.body.exam_id)
    const student_id = cryptr.decrypt(req.body.student_id)
    getAnsare( exam_id , student_id , (err, results)=>{
      if( err){
        console.log(err)
      }
      getGroupExamQuiz (exam_id,(err,resultss)=>{
        if(err){
          console.log(err)
        }
        resultss.forEach(element1 => {
          results.forEach(element2 => {
            if(element2.quiz_id == element1.id){
              element1.student_ans = element2.student_answer
            }
          });
        });
        return res.status(200).json({
          apiStatus: true, data:  resultss, message: "succeeded"
        });
      })

    })
  },
  uplodeImage : (req , res)=>{
    const image = `http://localhost:3000/${req.file.filename}`
    const teacher_id = cryptr.decrypt(req.params.teacher_id)
    getOldImage ( teacher_id ,( err , resultsIamge)=>{
      if (err) {
        console.log(err)
      }
      if( resultsIamge.image.length > 2){
        const clear = resultsIamge.image.replace('http://localhost:3000/', 'uploads\\')
        fs.unlink(clear, function (err) { if (err) throw err; })
      }
      uplodeImage(teacher_id, image, (err, results) => {
        if (err) {
          console.log(err)
        }
        return res.status(200).json({
          apiStatus: true,data: image, message: "succeeded"
  
        });
      })
    })
   
  },
  getprofile:(req , res)=>{
    const id = cryptr.decrypt(req.params.id)
    getprofile(id, (err, results) => {
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
  updateGovernorate:(req,res)=>{
    const data = req.body
  login.get(data.email, (err, results) => {
  const result = compareSync(data.password, results.password);
  if( result){
    updateGovernorate ( data , (err , resu)=>{
      if (err){
        return err
      }
        return res.status(200).json({
          apiStatus: true, message: "The Governorate has been updated successfuly"
        })
    })
  }else{
            return res.status(500).json({
          apiStatus: false, message: "The password is wrong"
        })
  }

  })

  },
  updateScientific_article:(req,res)=>{
    const data = req.body
  login.get(data.email, (err, results) => {
  const result = compareSync(data.password, results.password);
  if( result){
    updateScientific_article ( data , (err , resu)=>{
      if (err){
        return err
      }
        return res.status(200).json({
          apiStatus: true, message: "The  Scientific article has been updated successfuly"
        })
    })
  }else{
            return res.status(500).json({
          apiStatus: false, message: "The password is wrong"
        })
  }

  })

  },
  updateEducational_class:(req,res)=>{
    const data = req.body
  login.get(data.email, (err, results) => {
  const result = compareSync(data.password, results.password);
  if( result){
    updateEducational_class ( data , (err , resu)=>{
      if (err){
        return err
      }
        return res.status(200).json({
          apiStatus: true, message: "The update Educational class article has been updated successfuly"
        })
    })
  }else{
            return res.status(500).json({
          apiStatus: false, message: "The password is wrong"
        })
  }

  })

  },
  updateReservation:(req,res)=>{
    const data = req.body
  login.get(data.email, (err, results) => {
  const result = compareSync(data.password, results.password);
  if( result){
    updateReservation ( data , (err , resu)=>{
      if (err){
        return err
      }
        return res.status(200).json({
          apiStatus: true, message: "The Reservation  has been updated successfuly"
        })
    })
  }else{
            return res.status(500).json({
          apiStatus: false, message: "The password is wrong"
        })
  }

  })

  },
  resetPassword : ( req , res)=>{
      const data = req.body
      login.get(data.email, (err, results) => {
        const result = compareSync(data.password, results.password);
        const salt = genSaltSync(10);
        data.newpassword = hashSync(data.newpassword, salt);
        if( result){
          resetPassword ( data , (err , resu)=>{
            if (err){
              return err
            }
              return res.status(200).json({
                apiStatus: true, message: "The password  has been updated successfuly"
              })
          })
             }else{
                  return res.status(500).json({
                apiStatus: false, message: "The password is wrong"
              })
        }
      
        })
      },
  resetPasswordLogout : ( req , res)=>{
        const data = req.body
        login.get(data.email, (err, results) => {
          const result = compareSync(data.password, results.password);
          const salt = genSaltSync(10);
          data.newpassword = hashSync(data.newpassword, salt);
          if( result){
            resetPassword ( data , (err , resu)=>{
              if (err){
                return err
              }
              if(!resu.affectedRows){
                return res.status(500).json({
                  apiStatus: true, message: " The password code is worng"
                })
              }
              logout (data,(err,resu2)=>{
                if(err){
                  console.log(err)
                }
                if (!resu2.affectedRows) {
                  return res.status(500).json({
                    apiStatus: true, message: " The password code is worng"
                  })
                }
                const token = sign(
                  {id:results.id,type:results.type,JWT:resu2.JWT}, "qwe1234", {
                  expiresIn: "1h"
                });
                return res.status(200).json({
                  apiStatus: true, date:token , message: "The password  has been updated successfuly"
                })
              })
               })
               }else{
                    return res.status(500).json({
                  apiStatus: false, message: "The password is wrong"
                })
          }
        
          })
        },
  forgotPassword : (req , res)=>{
        const email = req.body
        forgotPassword ( email , (err , resu)=>{
          if (err){
            return err
          }
            return res.status(200).json({
              apiStatus: true, message: "The verification code has been sent"
            })
        })

      },
  newPassword : (req , res)=>{
        const otp = req.body
        const salt = genSaltSync(10);
        const userpassword = Genpassword(6)
        console.log(userpassword)
        const datapassword = hashSync(userpassword , salt);
        newPassword ( otp ,datapassword, (err , resu)=>{
          if (err){
            return err
          }
          if(!resu.affectedRows){
            return res.status(500).json({
              apiStatus: true, message: " The verification code is worng"
            })
          }else{
            return res.status(200).json({
              apiStatus: true, message: " a new password has been sent successfuly"
            })
          }
            
        })
  },
  newPasswordLogout : (req , res)=>{
    const otp = req.body
    const salt = genSaltSync(10);
    const userpassword = Genpassword(6)
    console.log(userpassword)
    const datapassword = hashSync(userpassword , salt);
    newPassword ( otp ,datapassword, (err , resu)=>{
      if (err){
        return err
      }
      if(!resu.affectedRows){
        return res.status(500).json({
          apiStatus: true, message: " The verification code is worng"
        })
      }else{
        login.get(otp.email, (err, results) => {
        logout (otp,(err,resu2)=>{
          if(err){
            console.log(err)
          }
          if (!resu2.affectedRows) {
            return res.status(500).json({
              apiStatus: true, message: "The verification code is worng"
            })
          }
          const token = sign(
            {id:results.id,type:results.type,JWT:resu2.JWT}, "qwe1234", {
            expiresIn: "1h"
          });
          return res.status(200).json({
            apiStatus: true, date:token , message: " a new password has been sent successfuly"
          })
        })
      })
      }
        
    })
}
      
  // updateEmail : (req , res)=>{
  // const data = req.body
  // get (data.newemail ,(err , findEmail)=>{
  //   if( err){
  //     return err
  //   }
  //   if(findEmail != undefined){
  //     return res.status(500).json({
  //         apiStatus: false, message: "This account is already registered"
  //       })
  //   }else{
  // login.get(data.oldemail, (err, results) => {
  //   if (err) {
  //     console.log(err)
  //   }
  // const result = compareSync(data.password, results.password);
  //     if (result) {
  //     updateEmail(data, (err, results) => {
  //       if (err) {
  //         return res.status(500).json({
  //           apiStatus: false, message: "error update Teacher"
  //         })
  //       }
  //       return res.status(200).json({
  //         apiStatus: true, message: "Email update successfuly"
  //       })
  //     })
  //     }else{
  //       return res.status(500).json({
  //         apiStatus: false, message: "The password is wrong"
  //       })
  //     }
   
  // })
  // }
  // })
  // },
//   start: (io)=> {
//     io.on('connection', function(socket) {
//       socket.on('message', (message) => {
//             console.log(message)
        
//             io.emit('message', message);
//           });
//           // socket.on('disconnect', () => {
//           // });
//     });
// },


}