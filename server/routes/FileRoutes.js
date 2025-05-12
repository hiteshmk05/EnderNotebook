const express=require("express");
const router=express.Router();
const {auth}=require("../middleware/auth");
const {uploadFile,createInlineFile}=require("../controllers/File");

router.post("/uploadFile",auth,uploadFile);
router.post("/createInlineFile",auth,createInlineFile);

module.exports=router;