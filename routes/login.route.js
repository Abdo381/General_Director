const loginController =require("../app/controller/login.controller")
const router = require('express').Router()
router.post("/login",loginController.login)
module.exports = router