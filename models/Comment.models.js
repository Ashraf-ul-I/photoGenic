import mongoose,{Schema} from "mongoose";

const commentSchema= new Schema({
    imageId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ImageUploader",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    userName: { type: String, required: true }, // Store userName directly in the Comment
    content: { type: String, required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, 
        ref: "Comment", default: null }, // For replies
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

// Indexing for faster querying
commentSchema.index({ imageId: 1, parentCommentId: 1, createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);