import mongoose, { Schema } from "mongoose";

const imageUploadSchema=new Schema({
    categoryName: { type: String, required: true, unique: true, index: true },
    images:[
        {
            imageTitle:{
                type:String,
                required:true
            },
            imageUrl:{
                type:String
            },
            likes:{
                type:Array,
                default:[]
            },
            comments:{
                type:Array,
                default:[]
            },
            description:{
                type:String
            },
            authorId:{
                type:mongoose.Schema.Types.ObjectId,ref:"User",required:true
            }
        }
    ]


    
})

export const ImageUploader= mongoose.model('ImageUploader',imageUploadSchema);