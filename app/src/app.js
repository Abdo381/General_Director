const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require("cors")
const app = express();
app.use(express.static("uploads"));
app.use(express.json())
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const studentsRouter = require("../../routes/student.route")
const teachersRouter = require("../../routes/teachers.route")
const parentisRouter = require("../../routes/parentis.route")
const loginRouter = require("../../routes/login.route")
app.use("", loginRouter)
app.use("/student", studentsRouter)
app.use("/teacher", teachersRouter)
app.use("/parent", parentisRouter)
// function welcome() {
//     console.log("Welcome!");
// }
// var id2 = setInterval(welcome, 1000);
// clearTimeout(id1);

module.exports = app