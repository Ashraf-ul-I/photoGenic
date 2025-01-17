import { User } from "../models/users.model.js";
import bcryptjs from 'bcryptjs'
import { generateJsonWebandCookies } from "../utils/generateCookies.utils.js";

//function to handle signUp 
export const signUp = async (req, res) => {
    const { email, password, name } = req.body;

    // Validate that all required fields are provided
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Request body is missing' });
    }

    try {
        // Check if a user with the same email already exists in the database
        const userAlreadyExist = await User.findOne({ userEmail:email });

        // If the user already exists, return a response indicating so
        if (userAlreadyExist) {
            return res.status(200).json({ success: false, message: 'User already exists!' });
        }

        // Email does not exist, so hash the password before saving it to the database
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate a random reset password token for the user
        // This is useful for password recovery in case of forgotten passwords
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const resetPasswordToken = Array.from({ length: 8 }, () =>
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join('');

        // Create a new user instance with the provided details and hashed password
        const user = new User({
            userName: name,
            userEmail: email,
            password: hashedPassword,
            forgetPassToken: resetPasswordToken // Store the reset password token
        });

        // Save the new user to the database
        await user.save();

        // Generate a JSON Web Token and set it in the response cookies
        generateJsonWebandCookies(res, user._id);

        // Respond with a success message and user details (excluding the password field)
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc, // Spread all user properties from the document
                password: undefined // Remove the password field for security
            }
        });

    } catch (error) {
        // Catch and handle any errors that occur during the process
        return res.status(400).json({ success: false, message: error.message });
    }
};


// Function to handle user login
export const login = async (req, res) => {
    // Destructure email and password from the request body
    const { email, password } = req.body;
   console.log(email,password)
    // Validate input fields: email and password are required
    if (!email || !password) {
        throw new Error('All fields are required'); // Throw an error if either field is missing
    }

    try {
        // Find the user in the database by email
        const user = await User.findOne({userEmail: email });

        // If the user is not found, send a 400 response with an error message
        if (!user) {
            return res.status(400).json({ success: true, message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const verifyPassword = await bcryptjs.compare(password, user.password);

        // If the password doesn't match, throw an error
        if (!verifyPassword) {
            throw new Error('User credentials are wrong');
        }

        // Generate a JSON Web Token and set it in the response cookies
        generateJsonWebandCookies(res, user._id);

        // Update the user's last login time
        user.lastLogin = new Date();
        await user.save(); // Save the updated user data to the database

        // Respond with a success message, excluding the password field from the response
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: {
                ...user._doc, // Spread all user properties from the document
                password: undefined // Remove the password field for security
            }
        });
    } catch (error) {
        // Catch any errors and send a 400 response with the error message
        res.status(400).json({ success: false, message: error.message });
    }
};

//function to handle forgetPassword
export const resetPassword=async (req,res)=>{
    //get the user inputs 
    const {email,newPassword,password,resetToken}=req.body;
    //at first check that is the user give all the input field data
    if(!email || !resetToken){
        throw new Error('all fileds are required');
    }
    //now we have to get the token from cookies for further user logged in access
    const token=req.cookies.token;


    try {
        //get the user using the email because email is always unique
        const user=await User.findOne({userEmail:email});
        //if user not found it will throw error
        if(!user){
            throw new Error('user not found');
        }
        //so if token found we will move for password change even we are logged in
        if(token){
            //at first decode the token for getting the userId in jwt
          const decoded=jwt.verify(token,process.env.JWT_SECRET);
          if(decoded.userId !==user._id.toString()){
            return res.status(401).json({success:false,message:'Invalid token'});
          }
         //then have to check that provided password is matched or not with previous pass
          const isPasswordValid=await bcryptjs.compare(password,user.password);
          if(!isPasswordValid){
            res.status(400).json({success:false,message:'Invalid Current Password'});
          }
          //because all the checking pass so now we hash the password for save
          const hashedPassword=await bcryptjs.hash(newPassword,10);

          user.password=hashedPassword;
          await user.save();
          return res.status(200).json({
            success: true,
            message: "Password has been changed successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
        }else{
            //if the token is not matched it will return failed message
            if(resetToken!==user.forgetPassToken){
                return res.status(400).json({success:false,message:'Invalid reset Token'})
            }
            //because token is valid so we just encrypt the password for safety
            const changePassword=await bcryptjs.hash(newPassword,10);
            //now assign the new password into previous user password
            user.password=changePassword;
            //then save the user collection for new pass
            await user.save();
            //now its time to return a success response with the json data
            return res.status(200).json({success:true,message:'password changed successfully',user:{
                ...user._doc,
                password:undefined
            }})
 
        }
    } catch (error) {
        
    }

}

export const logout = (req, res) => {
    try {
        // Clear the cookie with the same options as when it was set
        res.clearCookie('token', {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent cross-site request forgery
        });

        // Respond with a success message
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        // Handle errors gracefully
        return res.status(500).json({ success: false, message: 'An error occurred during logout' });
    }
};
