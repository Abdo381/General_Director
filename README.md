(                                                    teachers                                      )
 routName ( /GroupByIdPdf/:id/:tid ) get
 req ( id = id group , tid = id teacher )
 res( data {[results],[resultss]} 
 results = current group information 
 resultss = file pdf (link) 
 )
 <!--------------------------------------------------------------------------------->
 routName (/addPdf/:teacher_id/:group_id/:time) post
 req ( teacher_id , group_id , time ) => in header
 (file) => in body => name (PdfFile)
 res ( 200 :  message "succeeded")
 <!--------------------------------------------------------------------------------->

 routName (/deleteVideo/:id ) delete
 req ( id = id Video) in header
 res ( 200 :  message "succeeded" )
 <!--------------------------------------------------------------------------------->

 (                                                     student                                               )


 routName ( /groupChat )  post 
  req ( id = id student)  in body
  res ( data : [newResults]) ( لو مفيش رسايل من المدرس للمجموعه مش هاتيجي هنا ))
 <!--------------------------------------------------------------------------------->
  routName ( /seen )  post 
req (student_id = student_id,
      group_id = group_id,
      last_message = id last_message) in body

 res ( 200 :  message "succeeded" )
 <!--------------------------------------------------------------------------------->
  routName ( /getCaht )  post 
  req ( ids = student id ) in body
 res ( data : [results] )
  <!--------------------------------------------------------------------------------->
  routName ( /MygroupsOnline )  post 
  req ( student_id = student id ) in body
  res ( data : [results] )
    <!--------------------------------------------------------------------------------->
  routName ( /getGroupTutorials/:group_id )  get 
  req ( group_id = group id ) in body
  res ( data : { [results] , [resultss]})
   results = current group information 
 resultss = file pdf (link) 
    <!--------------------------------------------------------------------------------->
  routName ( /getVideosGroup/:group_id )  get 
  req ( group_id = group id ) in body
  res ( data : { [results] , [resultss]})
   resultss = current group information 
 results = videos (link) 
<!--------------------------------------------------------------------------------->
  routName ( /getExamVideo )  post 
  req ( video_id = video id , group_id = group id , student_id = student id  , today = date right Now  ) in body
  res ( data :  [results] )
<!--------------------------------------------------------------------------------->
 routName ( /attendeesonline )  post 
 req ( student_id , teacher_id , group_id ,video_id , (Attendees)=>boolean , (date)=>date right Now ,)
 res ( 200 :  message "succeeded" )
<!--------------------------------------------------------------------------------->
  routName ( /getVideosGroup/:group_id )  post 
  req ( (group_id = group id)=>in header , (date = date right Now)=> in body ) 
  res ( data : { [results] , [resultss]})
   resultss = current group information 
 results = exams group 
 <!--------------------------------------------------------------------------------->
  routName ( /studentOpenExam )  post 
  req( teacher_id , group_id , student_id , exam_id )
  res ( data: [results] )
   <!--------------------------------------------------------------------------------->
  routName ( /note )  post 
  req( student_id , time)
  res ( data : [newResults])
   <!--------------------------------------------------------------------------------->
 routName ( /MygroupsOnline )  post 
  req ( student_id = student id ) in body
  res ( data : [results] )
