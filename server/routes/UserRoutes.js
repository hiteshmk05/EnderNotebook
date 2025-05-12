const express=require("express");
const router=express.Router();
const {auth}=require("../middleware/auth");
const {signup,login,sendOTP}=require("../controllers/Auth");

router.post("/signup",signup);

router.post("/sendOTP",sendOTP);

router.post("/login",login);

module.exports=router;