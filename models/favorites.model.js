import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  favourite: [
    {
      imageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
},{timestamps:true});

export const Favorite = mongoose.model("Favorite", favoriteSchema);
