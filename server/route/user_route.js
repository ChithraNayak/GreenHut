const express = require("express");
const router = express.Router();
const {
  Userregister,
  Userlogin,
  resetPassword,
  getoneuser,
  getuser,
  getalluser,
  getAllBookings,
  bookAnExpert,
  getAllNotifications,
} = require("../controller/user_controller");
// const { handleLogin } = require('../controller/logincontroller');
const auth = require("../middleware/auth_middleware");

router.post("/Userregister", Userregister);
router.post("/Userlogin", Userlogin);
router.post("/reset-password", resetPassword); // New route for password reset
router.get("/getuser", auth, getuser);
router.put("/getoneuser/:id", getoneuser);
router.get("/getusers", getalluser);
router.post("/bookAnExpert", auth, bookAnExpert);
router.get("/getAllBookings", auth, getAllBookings);
router.get("/getAllNotifications", auth, getAllNotifications);

module.exports = router;
