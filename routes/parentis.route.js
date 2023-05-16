const parentisController = require('../app/controller/parentis.controller')
const router = require('express').Router()
router.post("/sign-up",parentisController.createParent)
router.post("/verify",parentisController.verifyotp)
// router.get("/me/:id",parentisController.getUserByUserId)

module.exports = router