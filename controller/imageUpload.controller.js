import { ImageUploader } from "../models/imageUpload.model.js";

export const uploadImage = async (req, res) => {
    // Destructure required fields from the request body
    const { imgTitle, category, description } = req.body;
    
    // Validate that all required fields are provided
    if (!imgTitle || !category || !description) {
        throw new Error('All fields are required'); // Throw an error if any field is missing
    }
    
    // Extract the userId from the authenticated user's information
    const userId = req.user.userId;
    if (!userId) {
        throw new Error('User is not logged in!'); // Throw an error if userId is not available
    }

    // Check if the uploaded file exists and extract its path
    const photoUrl=req.file?req.file.path:null;
    if (!photoUrl) {
        return res.status(400).json({ success: false, message: "Image file is required" }); // Respond with an error if no file is provided
    }

    try {
        // Find the document for the specified category in the database
        let categoryDoc = await ImageUploader.findOne({ categoryName: category });
        
        // If the category does not exist, create a new document for it
        if (!categoryDoc) {
            categoryDoc = new ImageUploader({ categoryName: category, images: [] });
        }

        // Add the new image details to the `images` array of the category document
        categoryDoc.images.push({
            imageTitle: imgTitle,   // Title of the image
            imageUrl: photoUrl,    // URL or path to the uploaded image
            description,           // Description of the image
            authorId: userId,      // ID of the user who uploaded the image
        });

        // Save the updated category document to the database
        await categoryDoc.save();

        // Respond with a success message and the updated category document
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            category: categoryDoc, // Return the updated category with the new image
        });
    } catch (error) {
        // Handle any errors during the process and send a 500 response
        res.status(500).json({ success: false, message: error.message });
    }
};
