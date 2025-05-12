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
