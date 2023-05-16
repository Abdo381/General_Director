const studentsController = require('../app/controller/students.controller')
const {checkToken}=require('../middleware/auth_s')
const upload = require("../middleware/files")
const router = require('express').Router() 
router.post("/sign-up",studentsController.createStudent) 
router.post("/verify/:email",studentsController.verifyotp)
router.get("/me/:id",studentsController.getUserByUserId)
router.get("/Reservation/:teacher_id/:student_id/:group_id/:time_join",studentsController.Reservation)
router.post('/ReservationOnline/:teacher_id/:student_id/:group_id/:time_join',upload.single('name'),studentsController.ReservationOnline)
router.post('/groupChat',studentsController.groupChat)
router.post('/message',studentsController.message)
router.post('/getCaht',studentsController.getChat)
router.post('/seen',studentsController.seen)
router.post('/MygroupsOnline',studentsController.getMygroupsOnline)
router.get('/getGroupTutorials/:group_id',studentsController.getGroupTutorials)
router.get('/getVideosGroup/:group_id',studentsController.getVideosGroup)
router.post('/getExamVideo',studentsController.getExamVideo)
router.post('/attendeesonline',studentsController.attendeesonline)
router.post('/getExamsGroup/:group_id',studentsController.getExamsGroup)
router.post('/studentOpenExam',studentsController.studentOpenExam)
router.post('/note',studentsController.note)
router.post('/answerStudent',studentsController.answerStudent)
router.post('/MygroupsOffline',studentsController.getMygroupsOffline)
router.post('/addImage/:student_id',upload.single('image'),studentsController.uplodeImage)









//   (req, res) => { 
//   try {
//     console.log("uploading...");
//     console.log(req.file.filename);
//     res.json({ cool: "yes" });
//     // res.json({ file: req.file });
//   } catch (error) {
//     console.log(error);
//   }
// }) 
// router.post('/profile',upload.single('name'), function (req, res, next) {
  // console.log(req.file)
//   if (!req.file) {
//     console.log("No file upload");
// } else {
//     console.log(req.file.filename)
//     var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
//     var insertData = "INSERT INTO image(image)VALUES(?)"
//     db.query(insertData, [imgsrc], (err, result) => {
//         if (err) throw err
//         console.log("file uploaded")
//     })
// }
  // })
module.exports = router  