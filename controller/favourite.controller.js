import { Favorite } from "../models/favorites.model.js";
import { ImageUploader } from "../models/imageUpload.model.js";

//approach
/**
 * Handles the user's favorite image action by adding an image to their favorites list.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.imgId - The ID of the image to be favorited.get from frontend when we send fetch body
 * @param {Object} req.user - The authenticated user object.
 * @param {string} req.user.userId - The ID of the authenticated user.Its comes from middleware which verify the user is authenticated or not
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Sends a JSON response indicating the success or failure of the operation.
 */



export const userFavourite = async (req, res) => {
  const { imgId } = req.body; // Get image ID from request body
  const userId = req.user?.userId; // Get user ID from middleware

  if (!imgId) {
    return res.status(400).json({ success: false, message: "Image ID not found" });
  }
  if (!userId) {
    return res.status(400).json({ success: false, message: "User is not authenticated" });
  }

  try {
    // Check if the image exists
    const imageExists  = await ImageUploader.findOne({ "images._id": imgId });
    if (!imageExists  ) {
      return res.status(400).json({ success: false, message: "There is no image found" });
    }

    // Find the user's favorite list
    let favouriteList = await Favorite.findOne({ userId });
    if (!favouriteList) {
      // Create a new favorite list if none exists
      favouriteList = new Favorite({ userId, favourite: [{ imageId: imgId }] });
    } else {
      // Check if the image is already favorited
      const isFavourited = favouriteList.favourite.some(
        (fav) => fav.imageId && fav.imageId.equals(imgId)
      );
      if (isFavourited) {
        return res.status(400).json({ message: "Image already favorited" });
      }

      // Add the image to the favorite list
      favouriteList.favourite.push({ imageId: imgId });
    }

    // Save the updated favorite list
    await favouriteList.save();

    res.status(200).json({ message: "Image favorited successfully", favorite: favouriteList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
