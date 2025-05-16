const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
    {
        user:{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        folderName:{ 
            type: String, 
            required: true 
        },
        level:{ 
            type: Number, 
            required: true,
            min: 1, 
            max: 4 
        },
        parent:{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Folder', 
            default: null 
        }
    }, 
    {
        toJSON:   { virtuals: true },
        toObject: { virtuals: true }    
    }
);

folderSchema.index({ user: 1, parent: 1 });  // speed up owner+parent queries

/* 
    this will help in checking if a folder exists for a particular user at a particular level
    we index at this and mongodb will find if this value already exists
    if value already exists it will throw an error 
    this helps in race conditons when we get same request of creating a folder
    suppose a user x sends 2 request to create a folder named 'test' at a level say y
    if we use the typical 'findOne' method then a race condition could occur 
*/
folderSchema.index({user:1,folderName:1,parent:1},{unique:true}); 


folderSchema.virtual('children', {
    ref: 'Folder',
    localField: '_id',
    foreignField: 'parent'
});

folderSchema.virtual('files', {
    ref: 'File',
    localField: '_id',
    foreignField: 'folder'
});

//virtual - dynamic field not different from normal mongodb fields
//on the fly adding thing

module.exports = mongoose.model('Folder', folderSchema);
