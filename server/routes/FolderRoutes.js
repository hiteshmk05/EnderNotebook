const express=require("express");
const router=express.Router();
const {auth}=require("../middleware/auth");
const {createFolder}=require("../controllers/Folder");

router.post("/createFolder",auth,createFolder);

module.exports=router;