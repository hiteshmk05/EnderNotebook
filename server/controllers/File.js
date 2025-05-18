const cloudinary= require('../config/cloudinaryConfig.js');
const File = require('../models/File');
const Folder= require('../models/Folder');
const sendResponse= require('../utils/responseHandler');

// exports.uploadFile=async (req,res)=>{

// 	console.log("Headers:", req.headers);
// 	console.log("Content-Length:", req.headers['content-length']);
// 	console.log("Body-type before Multer:", req.get('content-type'));

// 	const userID   = req.user.id;
// 	const { folderID } = req.body;

// 	if (!req.file) {
// 		return sendResponse(res, 400, false, 'no file provided');
// 	}

// 	if (folderID) {
// 		const folder = await Folder.findOne({ _id: folderID, user: userID });
		
// 		if (!folder) {
// 			return sendResponse(res, 404, false, 'Target folder not found');
// 		}
// 	}

// 	// Upload buffer to Cloudinary
// 	const result = await new Promise((resolve, reject) => {
// 		const stream = cloudinary.uploader.upload_stream(
// 		{ folder: 'endernotebook', resource_type: 'raw' },
// 		(error, result) => error ? reject(error) : resolve(result)
// 		);
// 		stream.end(req.file.buffer);
// 	});

// 	// Persist file record
// 	const payload = {
// 		user: userID,
// 		folder: folderID || null,
// 		fileName: req.file.originalname,
// 		type: 'pdf',
// 		url: result.secure_url,
// 		publicId: result.public_id
// 	};
// 	const newFile = await File.create(payload);

// 	return sendResponse(res, 201, true, 'PDF uploaded successfully', { file: newFile });
// };

exports.uploadFile = async (req, res) => {
  try {
    const userID   = req.user.id;
    const { folderID } = req.body;
    const originalName = req.file?.originalname;

    //Basic validation
    if (!req.file) {
      return sendResponse(res, 400, false, 'No file provided');
    }

    if (folderID) {
      const folder = await Folder.findOne({ _id: folderID, user: userID });
      if (!folder) {
        return sendResponse(res, 404, false, 'Target folder not found');
      }
    }

    // Create stub in MongoDB (this fires the unique index check)
    let fileDoc;
    try {
      fileDoc = await File.create({
        user:     userID,
        folder:   folderID || null,
        fileName: originalName,
        type:     'pdf'
      });
    } catch (err) {
      if (err.code === 11000) {
        return sendResponse(res, 409, false,
          'A file with that name already exists in this folder');
      }
      throw err;
    }

    // Upload buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'endernotebook', resource_type: 'raw' },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    // Update the stub with Cloudinary URLs
    fileDoc.url      = uploadResult.secure_url;
    fileDoc.publicId = uploadResult.public_id;
    await fileDoc.save();

    // Final response
    return sendResponse(res, 201, true,
      'PDF uploaded successfully', { file: fileDoc });

  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, 'Internal server error');
  }
};

exports.createNoteFile=async (req,res)=>{
    try {
        const userID=req.user.id;
        const {fileName,folderID,type,content}=req.body;

        if(!fileName || type!=='note'){
            return sendResponse(res,400,false,"file name and type not specified");
        }

        /* 
            checking if a file already exists with the specified name
            using indexing
        */
        if(folderID){
            const folder = await Folder.findOne({_id:folderID,user:userID});
            
            if(!folder){
                return sendResponse(res,400,false,"folder doesnt exist");
            }
        }

        const noteFilePayload={
            user:userID,
            fileName,
            folder:folderID || null,
            type,
            content:content || '',
        };

        try {
            const newNoteFile=await File.create(noteFilePayload);

            return sendResponse(res,201,true,"note file created",{file:newNoteFile});   
        } catch (error) {
            if(error.code===11000){
                return sendResponse(res,400,false,"file alreadt exists in this levle");
            }
            throw error;
        }

    } catch (error) {
        console.log(error);
        return sendResponse(res,500,false,"bad request something idk get rekt");
    }
};