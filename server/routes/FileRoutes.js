const express=require("express");
const router=express.Router();
const {auth}=require("../middleware/auth");
const {uploadFile,createNoteFile}=require("../controllers/File");
// const multerMemory   = require('../config/multerMemory'); 
const upload  = require('../config/multerMemory');

router.post("/uploadFile",auth,upload.single('file'),uploadFile);
router.post("/createInlineFile",auth,createNoteFile);

module.exports=router;