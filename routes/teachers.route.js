const teachersController = require('../app/controller/teachers.controller')
const {checkToken}=require('../middleware/auth_t')
const upload = require("../middleware/files")
const router = require('express').Router()
router.post("/sign-up",teachersController.createTeacher)
router.post("/verify/:email",teachersController.verifyotp)
router.get("/me/:id",checkToken,teachersController.getUserByUserId)
router.get("/all",teachersController.getAll)
router.post("/addGroup/:id",checkToken,teachersController.AddGroup) 
router.get("/allGroup/:id",checkToken,teachersController.getAllgroup) 
router.get("/Group/:id/:tid",checkToken,teachersController.getGroupById)/////all groups
router.delete("/deleteGroup/:id",checkToken,teachersController.deleteGroup)
router.get("/teacher/:id",checkToken,teachersController.getTeacherById) 
router.get("/teacherGroup/:id",checkToken,teachersController.getGroupsTeacherById)
router.get("/Attendees/:id",checkToken,teachersController.getAllgroup2) 
router.post("/Attendees",checkToken,teachersController.Attendees) 
router.get("/Attendees/:id/:ids",checkToken,teachersController.AttendeesDetails) 
router.post('/getCaht',checkToken,teachersController.getChat)
router.delete("/deleteStudent/:id/:group_id",checkToken,teachersController.deleteStudent)
router.patch("/updateGroup",checkToken,teachersController.updateGroup)
router.patch("/removeTo",checkToken,teachersController.removeTo)
router.post("/GroupOnline",checkToken,teachersController.getGroupOnline)///////all group 
router.get("/GroupOnline/:id/:tid",checkToken,teachersController.getGroupByIdO)//////video
router.get("/GroupOnlineExam/:id/:tid",checkToken,teachersController.getGroupByIdExam)
router.post('/addvideo/:teacher_id/:group_id/:time',checkToken,upload.single('name'),teachersController.addVideo)
router.post("/addExam",checkToken,teachersController.addExam)
router.post("/exam",checkToken,teachersController.exam)
router.post("/examQuestions",checkToken,teachersController.examQuestions)
router.post("/addLocation",checkToken,teachersController.addLocation)
router.get("/GroupByIdPdf/:id/:tid",checkToken,teachersController.getGroupByIdPdf)
router.post('/addPdf/:teacher_id/:group_id/:time',checkToken,upload.single('PdfFile'),teachersController.addPdf)
router.post('/addImage/:teacher_id',checkToken,upload.single('image'),teachersController.uplodeImage)
router.delete("/deleteVideo/:id",checkToken,teachersController.deleteVideo)
router.post("/getGroupExamQuiz",checkToken,teachersController.getGroupExamQuiz)
router.post("/getStudentOpenExam",checkToken,teachersController.getStudentOpenExam)
router.post("/getAnsare",checkToken,teachersController.getAnsare)
router.post("/getStudentDidntOpenExam",checkToken,teachersController.getStudentDidntOpenExam)
router.get("/profile/:id",checkToken,teachersController.getprofile)
// router.post("/updateEmail",teachersController.updateEmail)
router.post("/updateGovernorate",checkToken,teachersController.updateGovernorate)
router.post("/updateScientific_article",checkToken,teachersController.updateScientific_article)
router.post("/updateEducational_class",checkToken,teachersController.updateEducational_class)
router.post("/updateReservation",checkToken,teachersController.updateReservation)
router.post("/resetpassword",checkToken,teachersController.resetPassword)
router.post("/resetPasswordLogout",checkToken,teachersController.resetPasswordLogout)
router.post("/forgotPassword",checkToken,teachersController.forgotPassword)
router.post("/newPassword",checkToken,teachersController.newPassword)
router.post("/newPasswordLogout",checkToken,teachersController.newPasswordLogout)


















// app.post("/upload", function (req, res) {
  
//   // When a file has been uploaded
//   if (req.files && Object.keys(req.files).length !== 0) {
    
//     // Uploaded path
//     const uploadedFile = req.files.uploadFile;
  
//     // Logging uploading file
//     console.log(uploadedFile);
  
//     // Upload path
//     const uploadPath = __dirname
//         + "/upload/" + uploadedFile.name;
  
//     // To save the file using mv() function
//     uploadedFile.mv(uploadPath, function (err) {
//       if (err) {
//         console.log(err);
//         res.send("Failed !!");
//       } else res.send("Successfully Uploaded !!");
//     });
//   } else res.send("No file uploaded !!");
// });
module.exports = router 