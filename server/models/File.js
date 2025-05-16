const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    user:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    folder:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Folder', 
        default: null 
    },
    fileName:{
        type: String, 
        required: true 
    },
    type:{ 
        type: String, 
        enum: ['pdf', 'note'], 
        required: true 
    },
    
    //only pdf files wpuld be there
    url:{ type: String },  
    publicId:{type: String },  
    
    //stored in db 
    content:{type: String },      
    updatedAt: {type: Date, default: Date.now },

    sharedWith:[{ 
        user:{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        permission:{ 
            type: String, 
            enum: ['read','write'], 
            default: 'read' 
        }
    }]
    }, {timestamps: true} //created and updated at
);

fileSchema.index({ user: 1, folder: 1 }); //added indexes for faster lookups

fileSchema.index({user:1, folder:1,fileName:1},{unique:true});

module.exports = mongoose.model('File', fileSchema);
