import { Comment } from "../models/Comment.models.js"; // Import the Comment model to interact with the comments collection
import { User } from "../models/users.model.js"; // Import the User model to retrieve user information based on userId

// Controller function to handle posting a new comment
export const postComment = async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const { imageId, parentCommentId, content } = req.body;
    // Extract the userId from the authenticated user (middleware should have added it to req.user)
    const userId = req.user.userId;

    // Check if the user is authenticated by verifying if userId exists
    if (!userId) {
      return res.status(400).json({ success: false, message: "User is not authenticated" });
    }

    // Validate if both imageId and content are provided in the request body
    if (!imageId || !content) {
      return res.status(400).json({ message: "Image ID and content are required." });
    }

    // Find the user in the database based on the userId
    const user = await User.findOne({ _id: userId }).select('userName'); // Select only the userName field from the User collection
    // If the user is not found, return a 404 status with an appropriate error message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the userName from the fetched user document
    const userName = user.userName;

    // Create a new Comment document using the extracted data
    const newComment = new Comment({
      imageId, // The image this comment is associated with
      userId: userId, // The ID of the user who is posting the comment
      content, // The content of the comment
      userName: userName, // The userName of the user posting the comment
      parentCommentId: parentCommentId || null, // If parentCommentId exists, it means the comment is a reply; otherwise, it's a top-level comment
    });

    // Save the new comment to the database
    await newComment.save();

    // Send a response back to the client indicating the comment was successfully added
    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    // Log any errors that occurred during the process
    console.error(error);
    // Send a response back with a 500 status code if an error occurred while adding the comment
    res.status(500).json({ message: "Failed to add comment", error });
  }
};
